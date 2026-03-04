import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await api.login(formData);
      localStorage.setItem('token', result.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#f6f0ff] text-[#1f2d63]">
            <LogIn className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#111a3d]">Welcome Back</h1>
            <p className="text-sm text-slate-600">Sign in to continue your learning and support journey.</p>
          </div>
        </div>

        {error ? <div className="mb-4 rounded-md bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1f2d63]/50 focus:ring-2 focus:ring-[#1f2d63]/15"
              placeholder="Your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1f2d63]/50 focus:ring-2 focus:ring-[#1f2d63]/15"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#e84874] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d73a65] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Need an account?{' '}
          <Link to="/register" className="font-semibold text-[#1f2d63] hover:underline">
            Create one
          </Link>
        </p>
      </motion.section>
    </div>
  );
}


