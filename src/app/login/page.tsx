'use client';

import { useState } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <BackButton className="self-start mb-4" hidden={false} />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
          <button
            onClick={() => router.push('/register')}
            className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 py-2 rounded"
          >
            Create Mentor Account
          </button>
          <button
            onClick={() => router.push('/forgot-password')}
            className="w-full text-sm text-gray-500 hover:text-blue-600"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </main>
  );
}