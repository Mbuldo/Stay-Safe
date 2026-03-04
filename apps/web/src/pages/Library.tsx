import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpenText, Clock4, Search, Tag } from 'lucide-react';
import api from '../services/api';
import { fallbackArticles, type ArticleContent } from '../data/content';
import ArticleImage from '../components/content/ArticleImage';

const categories = [
  { id: 'all', name: 'All Articles' },
  { id: 'contraception', name: 'Contraception' },
  { id: 'sti-prevention', name: 'STI Prevention' },
  { id: 'relationships', name: 'Relationships' },
  { id: 'menstrual-health', name: 'Menstrual Health' },
  { id: 'mental-health', name: 'Mental Health' },
  { id: 'sexual-health', name: 'Sexual Health' },
  { id: 'pregnancy', name: 'Pregnancy' },
];

export default function Library() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<ArticleContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const queryCategory = searchParams.get('category');
    return categories.some(category => category.id === queryCategory) ? (queryCategory as string) : 'all';
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = (await api.getAllArticles({ limit: 100 })) as ArticleContent[];
        setArticles(data.length > 0 ? data : fallbackArticles);
      } catch (error) {
        console.error('Failed to load articles, using fallback content', error);
        setArticles(fallbackArticles);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const queryCategory = searchParams.get('category');
    const normalizedCategory = categories.some(category => category.id === queryCategory) ? queryCategory : 'all';
    if (normalizedCategory !== selectedCategory) {
      setSelectedCategory(normalizedCategory as string);
    }
  }, [searchParams, selectedCategory]);

  const filteredArticles = useMemo(() => {
    let filtered = articles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        article =>
          article.title.toLowerCase().includes(query) ||
          article.summary.toLowerCase().includes(query) ||
          article.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [articles, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#1f2d63]/30 border-t-[#1f2d63]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[24px] bg-[#1f2d63] px-8 py-10 text-white">
        <p className="text-xs tracking-[0.14em] text-slate-300 uppercase">Health Learn</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Educational Library</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Practical, inclusive sexual and reproductive health information inspired by evidence-based education models.
        </p>
      </section>

      <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Search topics, tags, or article titles..."
            className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-[#1f2d63]/50 focus:ring-2 focus:ring-[#1f2d63]/15"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setSelectedCategory(category.id);
                if (category.id === 'all') {
                  setSearchParams(previous => {
                    const next = new URLSearchParams(previous);
                    next.delete('category');
                    return next;
                  });
                  return;
                }
                setSearchParams(previous => {
                  const next = new URLSearchParams(previous);
                  next.set('category', category.id);
                  return next;
                });
              }}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-[#1f2d63] text-white'
                  : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {selectedCategory === 'all' && !searchQuery ? (
        <section>
          <h2 className="font-display text-2xl font-semibold text-[#111a3d]">Featured Articles</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {articles
              .filter(article => article.featured)
              .map((article, index) => (
                <ArticleCard key={article.id} article={article} featured index={index} />
              ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="font-display text-2xl font-semibold text-[#111a3d]">
          {selectedCategory === 'all'
            ? 'All Articles'
            : categories.find(category => category.id === selectedCategory)?.name || 'Articles'}
          <span className="ml-2 text-sm font-medium text-slate-500">({filteredArticles.length})</span>
        </h2>

        {filteredArticles.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500">
            <BookOpenText className="mx-auto mb-3 h-10 w-10 text-slate-400" />
            No articles match your current filters.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ArticleCard({
  article,
  featured = false,
  index = 0,
}: {
  article: ArticleContent;
  featured?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <Link
        to={`/library/${article.slug}`}
        className={`group block overflow-hidden rounded-2xl border bg-white transition-all hover:-translate-y-0.5 hover:shadow-md ${
          featured ? 'border-[#1f2d63]/25 shadow-sm' : 'border-slate-200'
        }`}
      >
        <ArticleImage
          title={article.title}
          imageUrl={article.imageUrl}
          containerClassName="relative h-48 overflow-hidden"
          imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
        >
          {featured ? (
            <span className="absolute left-3 top-3 rounded-md bg-[#e84874] px-2.5 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          ) : null}
        </ArticleImage>

        <div className="space-y-4 p-5">
          <div>
            <h3 className="font-display text-xl font-semibold text-[#111a3d]">{article.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{article.summary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock4 className="h-3.5 w-3.5" />
              {article.readTime} min read
            </span>
            <span className="inline-flex items-center gap-1 capitalize">
              <Tag className="h-3.5 w-3.5" />
              {article.category.replace('-', ' ')}
            </span>
          </div>

          <span className="inline-flex text-sm font-semibold text-[#1f2d63]">Read article</span>
        </div>
      </Link>
    </motion.div>
  );
}


