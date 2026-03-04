import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    email: '',
    termsAccepted: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    setFormData(previous => ({
      ...previous,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.termsAccepted) {
      setError('You must accept the terms and conditions.');
      return;
    }

    setLoading(true);

    try {
      const result = await api.register({
        username: formData.username,
        password: formData.password,
        age: parseInt(formData.age, 10),
        gender: formData.gender || undefined,
        email: formData.email || undefined,
        termsAccepted: formData.termsAccepted,
      });

      localStorage.setItem('token', result.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#f6f0ff] text-[#1f2d63]">
            <UserPlus className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#111a3d]">Create Account</h1>
            <p className="text-sm text-slate-600">Start personalized learning and support in a few steps.</p>
          </div>
        </div>

        {error ? <div className="mb-4 rounded-md bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <Field label="Username" id="username">
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              minLength={3}
              required
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1f2d63]/50 focus:ring-2 focus:ring-[#1f2d63]/15"
            />
          </Field>

          <Field label="Email (optional)" id="email">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1f2d63]/50 focus:ring-2 focus:ring-[#1f2d63]/15"
            />
          </Field>

          <Field label="Age" id="age">
            <input
              id="age"
              name="age"
              type="number"
              min={13}
              max={120}
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1f2d63]/50 focus:ring-2 focus:ring-[#1f2d63]/15"
            />
          </Field>

          <Field label="Gender (optional)" id="gender">
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1f2d63]/50 focus:ring-2 focus:ring-[#1f2d63]/15"
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </Field>

          <Field label="Password" id="password">
            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1f2d63]/50 focus:ring-2 focus:ring-[#1f2d63]/15"
            />
          </Field>

          <Field label="Confirm Password" id="confirmPassword">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              minLength={8}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1f2d63]/50 focus:ring-2 focus:ring-[#1f2d63]/15"
            />
          </Field>

          <label className="md:col-span-2 inline-flex items-start gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />
            I accept the terms and conditions and privacy policy.
          </label>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 rounded-md bg-[#e84874] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d73a65] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#1f2d63] hover:underline">
            Sign in
          </Link>
        </p>
      </motion.section>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}


