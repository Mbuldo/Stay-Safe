import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Search, Bookmark, Clock, Tag } from 'lucide-react';
import api from '../services/api';

const categories = [
  { id: 'all', name: 'All Articles' },
  { id: 'contraception', name: 'Contraception' },
  { id: 'sti-prevention', name: 'STI Prevention' },
  { id: 'relationships', name: 'Relationships' },
  { id: 'menstrual-health', name: 'Menstrual Health' },
  { id: 'mental-health', name: 'Mental Health' },
  { id: 'pregnancy', name: 'Pregnancy' },
];

export default function Library() {
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [selectedCategory, searchQuery, articles]);

  const loadArticles = async () => {
    try {
      const data = await api.getAllArticles({ limit: 100 });
      setArticles(data);
      setFilteredArticles(data);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredArticles(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Health Library</h1>
        <p className="text-muted-foreground">
          Evidence-based articles about sexual and reproductive health
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Featured Articles */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.filter(a => a.featured).map(article => (
              <ArticleCard key={article.id} article={article} featured />
            ))}
          </div>
        </div>
      )}

      {/* All Articles */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {selectedCategory === 'all' ? 'All Articles' : categories.find(c => c.id === selectedCategory)?.name}
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'})
          </span>
        </h2>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No articles found matching your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleCard({ article, featured = false }: { article: any; featured?: boolean }) {
  return (
    <Link
      to={`/library/${article.slug}`}
      className={`block bg-white rounded-lg border-2 hover:border-primary hover:shadow-lg transition-all overflow-hidden ${
        featured ? 'border-primary/50' : ''
      }`}
    >
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        {featured && (
          <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded mb-2">
            Featured
          </span>
        )}
        <h3 className="text-xl font-bold mb-2">{article.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.summary}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{article.readTime} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span className="capitalize">{article.category.replace('-', ' ')}</span>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-primary font-semibold hover:underline">
            Read more →
          </span>
        </div>
      </div>
    </Link>
  );
}