const { neon } = require('@neondatabase/serverless');
const { databaseUrl } = require('./env');

const sql = neon(databaseUrl);


const query = async (strings, ...values) => {
  try {
    const result = await sql(strings, ...values);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Execute a parameterized query using $1, $2, ... placeholders.
 * @neondatabase/serverless sql.query() returns a plain array.
 * We wrap it in {rows} to match the pg-style interface used across services.
 * @param {string} text - SQL query string
 * @param {Array} params - query parameters
 * @returns {{ rows: Array }}
 */
const queryRaw = async (text, params = []) => {
  try {
    const rows = await sql.query(text, params);
    return { rows: Array.isArray(rows) ? rows : [] };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

const testConnection = async () => {
  const result = await sql`SELECT NOW() AS now`;
  console.log('Database connected at:', result[0].now);
};

module.exports = { sql, query, queryRaw, testConnection };
