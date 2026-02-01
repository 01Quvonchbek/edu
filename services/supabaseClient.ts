
// @ts-ignore
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qatbvvvzskerofkazglw.supabase.co';
// Diqqat: Bu kalit standard formatdan farq qilishi mumkin, lekin siz bergan ma'lumotga asosan o'rnatildi.
const supabaseAnonKey = 'sb_publishable_FW3yXwd-ueKrJu9WenkgzA_xYz4CPwu';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL yoki Anon Key topilmadi. Iltimos, ma\'lumotlarni tekshiring.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
