import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock4, DollarSign, Globe, Mail, MapPin, Phone, Search, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { fallbackResources, type CampusResourceContent } from '../data/content';

const resourceTypes = [
  { id: 'all', name: 'All Resources' },
  { id: 'on-campus', name: 'On-Campus' },
  { id: 'clinic', name: 'Clinics' },
  { id: 'pharmacy', name: 'Pharmacies' },
  { id: 'counseling', name: 'Counseling' },
  { id: 'hotline', name: 'Hotlines' },
];

const serviceCategories = [
  { id: 'all', name: 'All Services' },
  { id: 'testing', name: 'STI Testing' },
  { id: 'contraception', name: 'Contraception' },
  { id: 'emergency', name: 'Emergency Care' },
  { id: 'counseling', name: 'Counseling' },
  { id: 'general', name: 'General Health' },
  { id: 'reproductive-health', name: 'Reproductive Health' },
  { id: 'womens-health', name: "Women's Health" },
];

export default function Resources() {
  const [resources, setResources] = useState<CampusResourceContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [studentFriendlyOnly, setStudentFriendlyOnly] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = (await api.getAllResources()) as CampusResourceContent[];
        setResources(data.length > 0 ? data : fallbackResources);
      } catch (error) {
        console.error('Failed to load resources, using fallback', error);
        setResources(fallbackResources);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredResources = useMemo(() => {
    let filtered = [...resources];

    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        resource =>
          resource.name.toLowerCase().includes(query) ||
          resource.address.toLowerCase().includes(query) ||
          resource.services.some(service => service.toLowerCase().includes(query))
      );
    }

    if (studentFriendlyOnly) {
      filtered = filtered.filter(resource => resource.studentFriendly);
    }

    return filtered;
  }, [resources, searchQuery, selectedCategory, selectedType, studentFriendlyOnly]);

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
        <p className="text-xs tracking-[0.14em] text-slate-300 uppercase">Support Finder</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Campus & Community Resources</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Find trusted, student-friendly care services for sexual and reproductive health support.
        </p>
      </section>

      <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Search by name, location, or service..."
            className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-[#1f2d63]/50 focus:ring-2 focus:ring-[#1f2d63]/15"
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FilterGroup label="Resource Type" selected={selectedType} options={resourceTypes} onSelect={setSelectedType} />
          <FilterGroup
            label="Service Category"
            selected={selectedCategory}
            options={serviceCategories}
            onSelect={setSelectedCategory}
          />
        </div>

        <label className="mt-4 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={studentFriendlyOnly}
            onChange={event => setStudentFriendlyOnly(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Student-friendly only
        </label>
      </section>

      <p className="text-sm text-slate-600">
        Showing {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'}.
      </p>

      {filteredResources.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500">
          <MapPin className="mx-auto mb-3 h-10 w-10 text-slate-400" />
          No resources match your current filters.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredResources.map((resource, index) => (
            <motion.article
              key={resource.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#111a3d]">{resource.name}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1 capitalize text-slate-600">
                      {resource.type.replace('-', ' ')}
                    </span>
                    {resource.studentFriendly ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-1 text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Student Friendly
                      </span>
                    ) : null}
                    {resource.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2.5 py-1 text-blue-700">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
                <InfoItem icon={MapPin} text={`${resource.address}, ${resource.city}`} />
                {resource.phone ? <InfoItem icon={Phone} text={resource.phone} href={`tel:${resource.phone}`} /> : null}
                {resource.email ? <InfoItem icon={Mail} text={resource.email} href={`mailto:${resource.email}`} /> : null}
                {resource.website ? <InfoItem icon={Globe} text="Visit Website" href={resource.website} external /> : null}
                {resource.latitude && resource.longitude ? (
                  <InfoItem
                    icon={MapPin}
                    text="Open in Google Maps"
                    href={`https://www.google.com/maps?q=${resource.latitude},${resource.longitude}`}
                    external
                  />
                ) : null}
                {resource.hours ? <InfoItem icon={Clock4} text={resource.hours} /> : null}
                {resource.costInfo ? <InfoItem icon={DollarSign} text={resource.costInfo} /> : null}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-semibold text-[#111a3d]">Services Offered</p>
                  <div className="flex flex-wrap gap-2">
                    {resource.services.map(service => (
                      <span
                        key={`${resource.id}-${service}`}
                        className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {resource.freeServices?.length ? (
                  <div>
                    <p className="mb-2 text-sm font-semibold text-emerald-700">Free Services</p>
                    <div className="flex flex-wrap gap-2">
                      {resource.freeServices.map(service => (
                        <span key={`${resource.id}-free-${service}`} className="rounded-md bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: Array<{ id: string; name: string }>;
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-[#111a3d]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              selected === option.id
                ? 'bg-[#1f2d63] text-white'
                : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  text,
  href,
  external,
}: {
  icon: ComponentType<{ className?: string }>;
  text: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <span className="inline-flex items-center gap-2">
      <Icon className="h-4 w-4 text-[#1f2d63]" />
      <span>{text}</span>
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
      {content}
    </a>
  );
}

