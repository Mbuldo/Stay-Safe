import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Tag, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../services/api';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    try {
      const data = await api.getArticleBySlug(slug!);
      setArticle(data);
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Article not found</h2>
        <Link to="/library" className="text-primary hover:underline">
          ← Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        to="/library"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-8 font-medium"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Library
      </Link>

      {article.imageUrl && (
        <div className="mb-10">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-80 object-cover rounded-2xl shadow-xl"
          />
        </div>
      )}

      <article className="bg-white rounded-2xl shadow-sm border">
        {/* Header */}
        <header className="px-8 md:px-16 py-10 border-b bg-gray-50">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-gray-900">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-base text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-cyan-500" />
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-500" />
              <span>{article.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-500" />
              <span>{new Date(article.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-cyan-100 text-cyan-700 text-sm font-medium rounded-full"
                >
                  <Tag className="h-3.5 w-3.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Summary/Introduction */}
        {article.summary && (
          <div className="px-8 md:px-16 py-8 bg-cyan-50 border-b border-cyan-100">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg text-cyan-900 mb-2">Article Summary</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{article.summary}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content with Better Spacing */}
        <div className="px-8 md:px-16 py-12">
          <div className="prose prose-xl max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12 prose-h1:pb-4 prose-h1:border-b prose-h1:border-gray-200 prose-h1:font-bold prose-h1:text-gray-900
            prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:text-cyan-600 prose-h2:pb-3 prose-h2:border-b prose-h2:border-cyan-100 prose-h2:font-bold
            prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-cyan-500 prose-h3:font-semibold
            prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-h4:text-gray-800 prose-h4:font-semibold
            prose-p:mb-6 prose-p:leading-relaxed prose-p:text-gray-700 prose-p:text-lg
            prose-ul:my-6 prose-ul:space-y-3
            prose-ol:my-6 prose-ol:space-y-3
            prose-li:text-gray-700 prose-li:leading-relaxed prose-li:text-lg
            prose-li:pl-2
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-em:text-gray-800
            prose-a:text-cyan-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-cyan-400 prose-blockquote:bg-cyan-50 
            prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-gray-700
            prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:text-cyan-700 prose-code:font-mono
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-lg prose-pre:my-8
            prose-hr:my-12 prose-hr:border-gray-200
          ">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // Consistent heading rendering
                h1: ({node, ...props}) => (
                  <h1 className="text-4xl font-bold mb-6 mt-12 pb-4 border-b border-gray-200 text-gray-900" {...props} />
                ),
                h2: ({node, ...props}) => (
                  <h2 className="text-3xl font-bold mb-6 mt-12 text-cyan-600 pb-3 border-b border-cyan-100" {...props} />
                ),
                h3: ({node, ...props}) => (
                  <h3 className="text-2xl font-semibold mb-4 mt-8 text-cyan-500" {...props} />
                ),
                h4: ({node, ...props}) => (
                  <h4 className="text-xl font-semibold mb-3 mt-6 text-gray-800" {...props} />
                ),
                // Add custom rendering for better list styling
                ul: ({node, ...props}) => (
                  <ul className="space-y-3 my-6 list-disc pl-8" {...props} />
                ),
                ol: ({node, ...props}) => (
                  <ol className="space-y-3 my-6 list-decimal pl-8" {...props} />
                ),
                li: ({node, ...props}) => (
                  <li className="text-gray-700 leading-relaxed" {...props} />
                ),
                // Make strong text stand out without background
                strong: ({node, ...props}) => (
                  <strong className="font-bold text-gray-900" {...props} />
                ),
                // Better section breaks
                hr: ({node, ...props}) => (
                  <hr className="my-12 border-t-2 border-gray-200" {...props} />
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Disclaimer Box */}
        <div className="px-8 md:px-16 py-8 bg-yellow-50 border-t border-yellow-200">
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Important Note</h4>
              <p className="text-yellow-800 text-sm leading-relaxed">
                This article provides general educational information only and should not replace professional medical advice. 
                If you have specific health concerns, please consult with a qualified healthcare provider.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Footer Navigation */}
      <div className="mt-12 py-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link
          to="/library"
          className="inline-flex items-center gap-2 text-primary hover:underline font-semibold text-lg"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Library
        </Link>
        
        <div className="text-sm text-gray-500">
          Last updated: {new Date(article.updatedAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8 bg-cyan-50 rounded-2xl p-8 border-2 border-cyan-200">
        <div className="max-w-3xl">
          <h3 className="font-bold text-2xl mb-3 text-gray-900">Need Personalized Guidance?</h3>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            Get AI-powered health assessments tailored to your situation, or find campus health resources near you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/assessment"
              className="inline-block bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 font-semibold shadow-md transition-all"
            >
              Take Free Assessment
            </Link>
            <Link
              to="/resources"
              className="inline-block bg-white text-gray-700 px-6 py-3 rounded-lg border-2 border-gray-300 hover:border-cyan-500 hover:bg-gray-50 font-semibold transition-all"
            >
              Find Health Resources
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}