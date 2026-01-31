
import { createClient } from '@supabase/supabase-js';

// Siz taqdim etgan Supabase loyihasi ma'lumotlari:
const supabaseUrl = 'https://dejzcgzkyrxglcuivozk.supabase.co';
const supabaseAnonKey = 'sb_publishable_gc9vDYb9E_yJW_xYrBYyww_AnvGixcT';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
