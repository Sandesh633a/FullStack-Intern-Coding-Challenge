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
 * @param {string} text - SQL query string
 * @param {Array} params - query parameters
 * @returns {{ rows: Array }}
 */
const queryRaw = async (text, params = []) => {
  try {
    let rows;
    if (typeof sql.query === 'function') {
      rows = await sql.query(text, params);
    } else if (typeof sql === 'function') {
      rows = await sql(text, params);
    } else {
      throw new Error('Neon database client is not properly initialized');
    }
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
