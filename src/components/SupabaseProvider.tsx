import { PropsWithChildren } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';
import { SupabaseProvider as NextSupabaseProvider } from '@supabase/auth-helpers-react';

const supabase = createSupabaseClient();

export default function SupabaseProvider({ children }: PropsWithChildren) {
  return (
    <NextSupabaseProvider supabaseClient={supabase}>
      {children}
    </NextSupabaseProvider>
  );
}