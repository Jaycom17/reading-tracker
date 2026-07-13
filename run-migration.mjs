import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://sctkmxwqizaarbtemiam.supabase.co'
const supabaseKey = 'sb_publishable_mv8s4uKp-T-3Yk1gjNBpXQ_zJaWaLuv'

const supabase = createClient(supabaseUrl, supabaseKey)

const sql = readFileSync('./supabase/migrations/001_create_tables.sql', 'utf-8')

const { data, error } = await supabase.rpc('exec_sql', { sql })

if (error) {
  console.error('Error:', error)
  process.exit(1)
}

console.log('Success:', data)