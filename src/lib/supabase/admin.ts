import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase Administrativo
 * Utiliza a SERVICE_ROLE_KEY para bypass de RLS.
 * USAR APENAS EM SERVER COMPONENTS / API ROUTES.
 */
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Configurações do Supabase ausentes no servidor.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
