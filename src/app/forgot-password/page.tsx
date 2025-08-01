'use client';

import { useState } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/reset-password',
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage('Reset link sent to your email');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <BackButton className="self-start mb-4" />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
          />
          <button
            onClick={handleSend}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>
      </div>
    </main>
  );
}