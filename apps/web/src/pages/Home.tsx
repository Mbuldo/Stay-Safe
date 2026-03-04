import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpenCheck, Compass, Flame, HeartHandshake, ShieldAlert, Sparkles, Stethoscope, TrendingUp } from 'lucide-react';
import { fallbackArticles, fallbackResources } from '../data/content';
import ArticleImage from '../components/content/ArticleImage';

const learningTracks = [
  {
    icon: ShieldAlert,
    title: 'Risk Assessments',
    description: 'Private check-ins that turn your answers into practical next steps.',
    href: '/assessment',
  },
  {
    icon: BookOpenCheck,
    title: 'Learn by Topic',
    description: 'Clear sexual and reproductive health education built for students.',
    href: '/library',
  },
  {
    icon: Compass,
    title: 'Find Support Fast',
    description: 'Discover student-friendly care, counseling, and emergency help.',
    href: '/resources',
  },
];

const trendingTopics = [
  {
    title: 'Birth control basics',
    tag: 'Contraception',
    href: '/library?category=contraception',
  },
  {
    title: 'STI testing guide',
    tag: 'STI Prevention',
    href: '/library?category=sti-prevention',
  },
  {
    title: 'Understanding consent',
    tag: 'Relationships',
    href: '/library?category=relationships',
  },
  {
    title: 'Period health on campus',
    tag: 'Menstrual Health',
    href: '/library?category=menstrual-health',
  },
];

export default function Home() {
  const featuredArticles = fallbackArticles.slice(0, 3);
  const supportHighlights = fallbackResources.slice(0, 3);

  return (
    <div className="space-y-10 md:space-y-12">
      <section className="relative overflow-hidden rounded-[34px] border border-[#1f2d63]/10 bg-gradient-to-br from-[#fff5ef] via-[#ffe7ef] to-[#f2e9ff] p-8 shadow-[0_30px_80px_rgba(52,36,84,0.14)] md:p-12">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#fbd46f]/30 blur-3xl" aria-hidden />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#e95d84]/20 blur-3xl" aria-hidden />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-[#1f2d63] uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Student SRH Education
            </p>

            <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-tight text-[#111a3d] md:text-6xl">
              Learn your body, protect your health, and get support that actually helps.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#353d63]">
              Stay-Safe combines trusted sexual health education with guided assessments and real support options so
              students can make informed decisions with confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/library"
                className="inline-flex items-center gap-2 rounded-md bg-[#e84874] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d73a65]"
              >
                Explore learning
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/resources"
                className="rounded-md border border-[#1f2d63]/20 bg-white/70 px-5 py-3 text-sm font-semibold text-[#1f2d63] transition hover:bg-white"
              >
                Find support
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1f2d63]/10 bg-white/75 p-5 backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-[#1f2d63] uppercase">
                <TrendingUp className="h-3.5 w-3.5" />
                Popular topics this week
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ffe8f0] px-2 py-1 text-[11px] font-semibold text-[#b1335f]">
                <Flame className="h-3 w-3" />
                Trending
              </span>
            </div>

            <div className="grid gap-2.5">
              {trendingTopics.map(topic => (
                <Link
                  key={topic.title}
                  to={topic.href}
                  className="group flex items-center justify-between rounded-xl border border-[#1f2d63]/10 bg-gradient-to-r from-white to-[#fff8fc] px-3.5 py-3 transition hover:-translate-y-0.5 hover:border-[#e84874]/35 hover:shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#1c2b58]">{topic.title}</p>
                    <p className="text-[11px] font-medium tracking-[0.08em] text-[#6a7395] uppercase">{topic.tag}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#b13d67] transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {learningTracks.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
          >
            <Link
              to={item.href}
              className="block h-full rounded-2xl border border-[#1f2d63]/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#f6f0ff] text-[#1f2d63]">
                <item.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold text-[#111a3d]">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#4a5278]">{item.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#e84874]">
                Open
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </motion.div>
        ))}
      </section>

      <section className="rounded-[26px] border border-[#1f2d63]/10 bg-white p-7 shadow-sm md:p-9">
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff2f4] text-[#e84874]">
            <Stethoscope className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-3xl font-semibold text-[#111a3d]">Featured articles</h2>
            <p className="text-sm text-[#5a638a]">Ready-to-read guidance for everyday sexual health decisions.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featuredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className="overflow-hidden rounded-xl border border-[#1f2d63]/10 bg-[#fffdfd]"
            >
              <ArticleImage title={article.title} imageUrl={article.imageUrl} containerClassName="h-40 w-full" />
              <div className="space-y-2 p-4">
                <h3 className="font-display text-xl font-semibold text-[#111a3d]">{article.title}</h3>
                <p className="line-clamp-2 text-sm text-[#586082]">{article.summary}</p>
                <Link to={`/library/${article.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[#e84874]">
                  Read article
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="rounded-[26px] border border-[#1f2d63]/10 bg-white p-7 shadow-sm md:p-9">
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf8ff] text-[#1f2d63]">
            <HeartHandshake className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-3xl font-semibold text-[#111a3d]">Support near you</h2>
            <p className="text-sm text-[#5a638a]">Student-friendly care options you can contact directly.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {supportHighlights.map(resource => (
            <article key={resource.id} className="rounded-xl border border-[#1f2d63]/10 bg-[#fafbff] p-4">
              <h3 className="font-display text-xl font-semibold text-[#111a3d]">{resource.name}</h3>
              <p className="mt-2 text-sm text-[#4e567c]">
                {resource.address}, {resource.city}
              </p>
              <p className="mt-2 text-xs font-semibold tracking-[0.1em] text-[#e84874] uppercase">
                {resource.type.replace('-', ' ')}
              </p>
            </article>
          ))}
        </div>

        <Link to="/resources" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1f2d63]">
          View all resources
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

