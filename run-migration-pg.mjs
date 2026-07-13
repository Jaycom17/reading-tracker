import pg from 'pg';
import { readFileSync } from 'fs';

const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres.sctkmxwqizaarbtemiam:sctkmxwqizaarbtemiam@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

const sql = readFileSync('./supabase/migrations/001_create_tables.sql', 'utf-8');

try {
  await pool.query(sql);
  console.log('Migration applied successfully!');
  
  // Verify tables exist
  const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  console.log('Tables:', tables.rows);
  
  // Check challenges table
  const challenges = await pool.query('SELECT * FROM challenges LIMIT 1');
  console.log('Challenges:', challenges.rows);
  
  // Check books table
  const books = await pool.query('SELECT * FROM books LIMIT 1');
  console.log('Books:', books.rows);
  
} catch (err) {
  console.error('Error:', err);
} finally {
  await pool.end();
}