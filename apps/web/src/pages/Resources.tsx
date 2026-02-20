import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Globe, Clock, DollarSign, CheckCircle, Search } from 'lucide-react';
import api from '../services/api';

const resourceTypes = [
  { id: 'all', name: 'All Resources' },
  { id: 'on-campus', name: 'On-Campus' },
  { id: 'clinic', name: 'Clinics' },
  { id: 'pharmacy', name: 'Pharmacies' },
  { id: 'counseling', name: 'Counseling' },
];

const serviceCategories = [
  { id: 'all', name: 'All Services' },
  { id: 'testing', name: 'STI Testing' },
  { id: 'contraception', name: 'Contraception' },
  { id: 'emergency', name: 'Emergency Care' },
  { id: 'counseling', name: 'Counseling' },
  { id: 'general', name: 'General Health' },
];

export default function Resources() {
  const [resources, setResources] = useState<any[]>([]);
  const [filteredResources, setFilteredResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStudentFriendlyOnly, setShowStudentFriendlyOnly] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [selectedType, selectedCategory, searchQuery, showStudentFriendlyOnly, resources]);

  const loadResources = async () => {
    try {
      const data = await api.getAllResources();
      setResources(data);
      setFilteredResources(data);
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (selectedType !== 'all') {
      filtered = filtered.filter(r => r.type === selectedType);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.services.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (showStudentFriendlyOnly) {
      filtered = filtered.filter(r => r.studentFriendly);
    }

    setFilteredResources(filtered);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Campus Health Resources</h1>
        <p className="text-muted-foreground">
          Find health centers, clinics, and services in Nairobi
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, location, or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Resource Type</h3>
          <div className="flex flex-wrap gap-2">
            {resourceTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Service Category</h3>
          <div className="flex flex-wrap gap-2">
            {serviceCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showStudentFriendlyOnly}
              onChange={(e) => setShowStudentFriendlyOnly(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Student-friendly only</span>
          </label>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'}
      </div>

      {filteredResources.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No resources found matching your filters.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceCard({ resource }: { resource: any }) {
  return (
    <div className="bg-white p-6 rounded-lg border-2 hover:border-primary transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">{resource.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="px-2 py-1 bg-gray-100 rounded capitalize">{resource.type.replace('-', ' ')}</span>
            {resource.studentFriendly && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Student Friendly
              </span>
            )}
            {resource.verified && (
              <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded">Verified</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2 text-gray-600">
          <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{resource.address}, {resource.city}</span>
        </div>

        {resource.phone && (
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-5 w-5" />
            <a href={`tel:${resource.phone}`} className="hover:text-primary">
              {resource.phone}
            </a>
          </div>
        )}

        {resource.email && (
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="h-5 w-5" />
            <a href={`mailto:${resource.email}`} className="hover:text-primary">
              {resource.email}
            </a>
          </div>
        )}

        {resource.website && (
          <div className="flex items-center gap-2 text-gray-600">
            <Globe className="h-5 w-5" />
            <a href={resource.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              Visit Website →
            </a>
          </div>
        )}

        {resource.hours && (
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-5 w-5" />
            <span>{resource.hours}</span>
          </div>
        )}

        {resource.costInfo && (
          <div className="flex items-start gap-2 text-gray-600">
            <DollarSign className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{resource.costInfo}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="font-semibold mb-2">Services Offered:</h4>
        <div className="flex flex-wrap gap-2">
          {resource.services.map((service: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {resource.freeServices && resource.freeServices.length > 0 && (
        <div className="mt-3">
          <h4 className="font-semibold text-green-700 mb-2">Free Services:</h4>
          <div className="flex flex-wrap gap-2">
            {resource.freeServices.map((service: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded"
              >
                ✓ {service}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}