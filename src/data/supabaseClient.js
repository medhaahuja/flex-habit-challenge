import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// If env vars aren't set (e.g. running without a backend configured yet),
// `supabase` stays null and the store falls back to local-only mode.
export const supabase = url && anonKey ? createClient(url, anonKey) : null
