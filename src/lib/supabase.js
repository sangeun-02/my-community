import { createClient } from '@supabase/supabase-js';

/**
 * Supabase 클라이언트
 * - URL / anon 키는 .env 의 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 에서 읽는다.
 *
 * Example usage:
 * import { supabase } from '../lib/supabase';
 * const { data, error } = await supabase.from('posts').select('*');
 */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
