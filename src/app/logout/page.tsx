'use client';

import { createSupabaseClient } from '@/lib/supabaseClient';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const supabase = createSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      await supabase.auth.signOut();
      router.replace('/login');
    }
    logout();
  }, []);

  return <p className="p-4">Logging out...</p>;
}