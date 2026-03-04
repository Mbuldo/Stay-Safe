import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, CircleUserRound, Menu, ShieldCheck, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
}

const PUBLIC_LINKS: NavItem[] = [
  { label: 'Library', href: '/library' },
  { label: 'Resources', href: '/resources' },
];

const PRIVATE_LINKS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Assessment', href: '/assessment' },
];

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem('token')));
    setMenuOpen(false);
  }, [location.pathname]);

  const links = useMemo(
    () => (isAuthenticated ? [...PUBLIC_LINKS, ...PRIVATE_LINKS] : PUBLIC_LINKS),
    [isAuthenticated]
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-[#1f2d63]/10 bg-[#fff6f1] text-[#2a2e49]">
        <div className="mx-auto flex w-[min(1200px,calc(100vw-2rem))] items-center justify-between py-2 text-xs">
          <p className="tracking-[0.08em] uppercase">Evidence-based learning for students and young adults</p>
          <p className="hidden text-slate-600 md:block">Emergency support: 911 | Sexual Assault Hotline: 800-656-4673</p>
        </div>
      </div>

      <div className="border-b border-[#1f2d63]/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-[min(1200px,calc(100vw-2rem))] items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f2d63] text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl font-semibold text-[#111a3d]">Stay-Safe</p>
              <p className="text-[11px] tracking-[0.16em] text-slate-500 uppercase">Learn. Protect. Thrive.</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/"
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'bg-[#f5f0ff] text-[#1f2d63]' : 'text-slate-700 hover:bg-[#f8f4ff]'
              }`}
            >
              Home
            </Link>
            {links.map(item => (
              <Link
                key={item.href}
                to={item.href}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.href ? 'bg-[#f5f0ff] text-[#1f2d63]' : 'text-slate-700 hover:bg-[#f8f4ff]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 rounded-md border border-[#1f2d63]/20 px-4 py-2 text-sm font-medium text-[#1f2d63] hover:bg-[#f8f4ff]"
                >
                  <CircleUserRound className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-md bg-[#e84874] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d73a65]"
                >
                  <BookOpen className="h-4 w-4" />
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 text-slate-700 md:hidden"
            onClick={() => setMenuOpen(open => !open)}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-[#1f2d63]/10 bg-white md:hidden"
          >
            <div className="mx-auto w-[min(1200px,calc(100vw-2rem))] space-y-1 py-3">
              <Link
                to="/"
                className={`block rounded-md px-4 py-2 text-sm font-medium ${
                  location.pathname === '/' ? 'bg-[#f5f0ff] text-[#1f2d63]' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Home
              </Link>
              {links.map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block rounded-md px-4 py-2 text-sm font-medium ${
                    location.pathname === item.href ? 'bg-[#f5f0ff] text-[#1f2d63]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="block rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 w-full rounded-md border border-slate-300 px-4 py-2 text-left text-sm font-medium text-slate-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link to="/login" className="rounded-md border border-slate-300 px-4 py-2 text-center text-sm text-slate-700">
                    Login
                  </Link>
                  <Link to="/register" className="rounded-md bg-[#e84874] px-4 py-2 text-center text-sm font-semibold text-white">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

