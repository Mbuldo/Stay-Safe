import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, CalendarDays, Clock4, Tag, UserRound } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../services/api';
import { fallbackArticles, type ArticleContent } from '../data/content';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroImageFailed, setHeroImageFailed] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const data = (await api.getArticleBySlug(slug)) as ArticleContent;
        setArticle(data);
        setHeroImageFailed(false);
      } catch (error) {
        const fallback = fallbackArticles.find(item => item.slug === slug) || null;
        setArticle(fallback);
        setHeroImageFailed(false);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#1f2d63]/30 border-t-[#1f2d63]" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="font-display text-3xl font-semibold text-[#111a3d]">Article not found</h1>
        <Link to="/library" className="mt-4 inline-flex items-center text-sm font-semibold text-[#1f2d63]">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to library
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-5xl space-y-6"
    >
      <Link
        to="/library"
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to library
      </Link>

      <article className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
        {article.imageUrl && !heroImageFailed ? (
          <div className="relative h-72 md:h-[24rem]">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover"
              onError={() => setHeroImageFailed(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111a3d]/90 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h1 className="font-display text-4xl font-semibold text-white md:text-5xl">{article.title}</h1>
            </div>
          </div>
        ) : (
          <header className="bg-[#1f2d63] p-8 md:p-10">
            <h1 className="font-display text-4xl font-semibold text-white">{article.title}</h1>
          </header>
        )}

        <div className="space-y-8 p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-4 w-4 text-[#1f2d63]" />
              {article.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock4 className="h-4 w-4 text-[#1f2d63]" />
              {article.readTime} min read
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-[#1f2d63]" />
              {new Date(article.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="rounded-xl border border-[#1f2d63]/15 bg-[#f5f7fb] p-5">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1f2d63]" />
              <div>
                <h2 className="font-display text-lg font-semibold text-[#111a3d]">Summary</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{article.summary}</p>
              </div>
            </div>
          </div>

          {article.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs text-slate-600"
                >
                  <Tag className="h-3.5 w-3.5" />
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="prose max-w-none prose-headings:font-display prose-headings:text-[#111a3d] prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-[#111a3d] prose-a:text-[#1f2d63]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
          </div>

          <div className="rounded-xl border border-amber-300/40 bg-amber-50 p-5 text-sm text-amber-900">
            <p className="font-semibold">Medical disclaimer</p>
            <p className="mt-2 leading-relaxed">
              This content is educational and does not replace professional medical advice.
            </p>
          </div>
        </div>
      </article>
    </motion.div>
  );
}

