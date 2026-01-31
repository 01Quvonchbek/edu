
// @ts-ignore
import { createClient } from '@supabase/supabase-js';

// Siz taqdim etgan yangi Supabase loyihasi ma'lumotlari:
const supabaseUrl = 'https://qatbvvvzskerofkazglw.supabase.co';
const supabaseAnonKey = 'sb_publishable_FW3yXwd-ueKrJu9WenkgzA_xYz4CPwu';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
