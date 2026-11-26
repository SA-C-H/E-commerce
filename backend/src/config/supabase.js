import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('your-project-id')) {
  console.warn('⚠️ AVERTISSEMENT : Les variables SUPABASE_URL ou SUPABASE_SERVICE_KEY ne sont pas encore configurées dans backend/.env');
}

// Client Supabase avec la clé de service (droits administrateur serveur)
// La clé de service bypasse le RLS automatiquement
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        // Force le rôle service_role pour bypasser le RLS sur toutes les requêtes
        'X-Supabase-Auth-Role': 'service_role',
      },
    },
    db: {
      schema: 'public',
    },
  }
);

