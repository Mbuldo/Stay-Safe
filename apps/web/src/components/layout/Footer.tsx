import { Link } from 'react-router-dom';
import { ExternalLink, LifeBuoy, PhoneCall } from 'lucide-react';

const learnLinks = [
  { label: 'Contraception', href: '/library?category=contraception' },
  { label: 'STI Prevention', href: '/library?category=sti-prevention' },
  { label: 'Consent & Relationships', href: '/library?category=relationships' },
  { label: 'Mental Health', href: '/library?category=mental-health' },
];

const supportLinks = [
  { label: 'Find Resources', href: '/resources' },
  { label: 'Take Assessment', href: '/assessment' },
  { label: 'Student Support', href: '/dashboard' },
  { label: 'Profile Settings', href: '/profile' },
];

export default function Footer() {
  return (
    <footer className="mt-16 overflow-hidden rounded-t-[32px] border-t border-[#2a3567]/25 bg-[#11173a] text-slate-200">
      <div className="mx-auto w-[min(1200px,calc(100vw-2rem))] py-12">
        <div className="mb-8 grid gap-6 rounded-2xl border border-white/10 bg-gradient-to-r from-[#1c2758] to-[#9b2c5c] p-6 md:grid-cols-[1.2fr_auto] md:items-center">
          <div>
            <p className="text-xs tracking-[0.14em] text-pink-100 uppercase">Need Immediate Help?</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-white">Reach emergency support right away.</h2>
            <p className="mt-2 text-sm text-slate-100/90">
              If you are in immediate danger, contact local emergency services or trusted crisis support now.
            </p>
          </div>
          <a
            href="https://www.rainn.org/resources"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-[#1a2450] hover:bg-slate-100"
          >
            <LifeBuoy className="h-4 w-4" />
            Crisis resources
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-semibold text-white">Stay-Safe</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Student-first sexual and reproductive health learning, guidance, and support in one trusted place.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[0.08em] text-slate-100 uppercase">Learn</p>
            <ul className="mt-3 space-y-2 text-sm">
              {learnLinks.map(item => (
                <li key={item.href}>
                  <Link to={item.href} className="text-slate-300 transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[0.08em] text-slate-100 uppercase">Support</p>
            <ul className="mt-3 space-y-2 text-sm">
              {supportLinks.map(item => (
                <li key={item.href}>
                  <Link to={item.href} className="text-slate-300 transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[0.08em] text-slate-100 uppercase">Emergency</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="inline-flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-rose-300" />
                Local emergency line: 911
              </li>
              <li>National Sexual Assault Hotline: 800-656-4673</li>
              <li>Use campus security and resident support channels where available.</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 text-xs text-slate-400">
          <p>Copyright {new Date().getFullYear()} Stay-Safe. Educational content only, not medical diagnosis.</p>
        </div>
      </div>
    </footer>
  );
}

