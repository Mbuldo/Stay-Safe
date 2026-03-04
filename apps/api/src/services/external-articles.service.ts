import { XMLParser } from 'fast-xml-parser';
import articlesService, { Article } from './articles.service';

type LibraryCategory =
  | 'contraception'
  | 'sti-prevention'
  | 'relationships'
  | 'menstrual-health'
  | 'mental-health'
  | 'sexual-health'
  | 'pregnancy';

interface MedlinePlusDocument {
  url: string;
  title: string;
  summary: string;
  snippet: string;
}

const CATEGORY_TERMS: Record<LibraryCategory, string> = {
  contraception: 'birth control contraception family planning',
  'sti-prevention': 'sexually transmitted infections prevention testing',
  relationships: 'healthy relationships consent sexual communication',
  'menstrual-health': 'menstruation menstrual disorders period pain',
  'mental-health': 'mental health sexual wellbeing stress anxiety',
  'sexual-health': 'teen sexual health safer sex',
  pregnancy: 'pregnancy prevention emergency contraception',
};

const MEDLINEPLUS_SEARCH_URL = 'https://wsearch.nlm.nih.gov/ws/query';
const SOURCE_AUTHOR = 'MedlinePlus (U.S. National Library of Medicine)';

export class ExternalArticlesService {
  private readonly parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    textNodeName: 'text',
    trimValues: false,
  });

  async refreshFromMedlinePlus(limitPerCategory = 4): Promise<number> {
    let importedCount = 0;

    for (const [category, term] of Object.entries(CATEGORY_TERMS) as Array<[
      LibraryCategory,
      string,
    ]>) {
      try {
        const documents = await this.fetchCategory(term, limitPerCategory);
        for (const document of documents) {
          const article = this.toArticle(document, category);
          articlesService.upsertArticleBySlug(article);
          importedCount += 1;
        }
      } catch (error) {
        console.warn(
          `Failed to refresh MedlinePlus articles for ${category}:`,
          error
        );
      }
    }

    return importedCount;
  }

  private async fetchCategory(
    term: string,
    limit: number
  ): Promise<MedlinePlusDocument[]> {
    const query = new URLSearchParams({
      db: 'healthTopics',
      term,
      retmax: String(limit),
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(`${MEDLINEPLUS_SEARCH_URL}?${query}`, {
        method: 'GET',
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `MedlinePlus request failed with status ${response.status}`
        );
      }

      const xml = await response.text();
      return this.parseDocuments(xml);
    } finally {
      clearTimeout(timeout);
    }
  }

  private parseDocuments(xml: string): MedlinePlusDocument[] {
    const parsed = this.parser.parse(xml) as {
      nlmSearchResult?: {
        list?: {
          document?: MedlinePlusRawDocument | MedlinePlusRawDocument[];
        };
      };
    };

    const rawDocuments = parsed.nlmSearchResult?.list?.document;
    if (!rawDocuments) {
      return [];
    }

    const documents = Array.isArray(rawDocuments) ? rawDocuments : [rawDocuments];
    return documents
      .map(document => this.normalizeDocument(document))
      .filter((document): document is MedlinePlusDocument => Boolean(document));
  }

  private normalizeDocument(
    document: MedlinePlusRawDocument
  ): MedlinePlusDocument | null {
    const contents = Array.isArray(document.content)
      ? document.content
      : [document.content];
    const byName = new Map<string, string>();

    for (const item of contents) {
      if (!item || !item.name) continue;
      byName.set(item.name, this.readContentValue(item));
    }

    const title = cleanText(byName.get('title') || '');
    const summaryHtml = decodeHtml(byName.get('FullSummary') || '');
    const snippetHtml = decodeHtml(byName.get('snippet') || '');
    const summary = cleanText(summaryHtml);
    const snippet = cleanText(snippetHtml);

    if (!document.url || !title) {
      return null;
    }

    return {
      url: document.url,
      title,
      summary: summary || snippet,
      snippet: snippet || summary,
    };
  }

  private readContentValue(content: MedlinePlusRawContent): string {
    if (typeof content.text === 'string') {
      return content.text;
    }
    if (typeof content === 'string') {
      return content;
    }
    return '';
  }

  private toArticle(
    document: MedlinePlusDocument,
    category: LibraryCategory
  ): Omit<Article, 'id' | 'createdAt' | 'updatedAt'> {
    const cleanSummary = document.summary || document.snippet;
    const summary =
      cleanSummary.length > 280
        ? `${cleanSummary.slice(0, 277).trim()}...`
        : cleanSummary;
    const slugSuffix = hashString(document.url).slice(0, 8);
    const slug = `medlineplus-${slugify(document.title)}-${slugSuffix}`;
    const wordCount = cleanSummary.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(3, Math.round(wordCount / 180));

    return {
      title: document.title,
      slug,
      category,
      subcategory: 'external-medlineplus',
      summary,
      content: `# ${document.title}

${cleanSummary}

## Source
- [Read the full topic on MedlinePlus](${document.url})

_Imported from MedlinePlus, U.S. National Library of Medicine._`,
      author: SOURCE_AUTHOR,
      readTime,
      tags: [category, 'medlineplus', 'evidence-based'],
      featured: false,
      imageUrl: undefined,
    };
  }
}

interface MedlinePlusRawContent {
  name?: string;
  text?: string;
}

interface MedlinePlusRawDocument {
  url?: string;
  content?: MedlinePlusRawContent | MedlinePlusRawContent[];
}

function decodeHtml(raw: string): string {
  return raw
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function cleanText(raw: string): string {
  return raw
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function hashString(input: string): string {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

export default new ExternalArticlesService();
