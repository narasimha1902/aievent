'use client';

import { useState } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';

const roles = [
  { label: 'Mentor', value: 'mentor' },
  { label: 'Admin', value: 'admin' },
  { label: 'Responder', value: 'responder' },
];

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'mentor',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          phone: form.phone,
          role: form.role,
        },
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <BackButton className="self-start mb-4" />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Mentor Account</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="space-y-4">
          <input
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="Phone Number"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
          />
          <select
            name="role"
            value={form.role}
            onChange={onChange}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="Password"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onChange}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
          />
          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
          <button
            onClick={() => router.push('/login')}
            className="w-full text-sm text-gray-500 hover:text-blue-600"
          >
            Back to Login
          </button>
        </div>
      </div>
    </main>
  );
}