import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, UserRound } from 'lucide-react';
import api from '../services/api';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    username: '',
    email: '',
    age: '',
    gender: '',
    location: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const user = await api.getCurrentUser();
        setForm({
          username: user.username || '',
          email: user.email || '',
          age: user.age ? String(user.age) : '',
          gender: user.gender || '',
          location: user.location || '',
        });
      } catch (loadError: any) {
        setError(loadError.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: value }));
    setSuccess('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await api.updateProfile({
        username: form.username.trim() || undefined,
        email: form.email.trim() || undefined,
        age: form.age ? parseInt(form.age, 10) : undefined,
        gender: form.gender || undefined,
        location: form.location.trim() || undefined,
      });
      setSuccess('Profile updated successfully.');
    } catch (submitError: any) {
      setError(submitError.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#1f2d63]/30 border-t-[#1f2d63]" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mx-auto max-w-3xl">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="mb-7 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#f6f0ff] text-[#1f2d63]">
            <UserRound className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#111a3d]">Profile Settings</h1>
            <p className="text-sm text-slate-600">Update your details to improve recommendation accuracy.</p>
          </div>
        </div>

        {error ? <div className="mb-4 rounded-md bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
        {success ? <div className="mb-4 rounded-md bg-emerald-100 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <InputField id="username" name="username" label="Username" value={form.username} onChange={handleChange} required />
          <InputField id="email" name="email" label="Email" type="email" value={form.email} onChange={handleChange} />
          <InputField id="age" name="age" label="Age" type="number" min={13} max={120} value={form.age} onChange={handleChange} />

          <div>
            <label htmlFor="gender" className="mb-2 block text-sm font-medium text-slate-700">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
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
          </div>

          <div className="md:col-span-2">
            <InputField id="location" name="location" label="Location" value={form.location} onChange={handleChange} placeholder="City or campus" />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="md:col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-[#e84874] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d73a65] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </section>
    </motion.div>
  );
}

function InputField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  min,
  max,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1f2d63]/50 focus:ring-2 focus:ring-[#1f2d63]/15"
      />
    </div>
  );
}


