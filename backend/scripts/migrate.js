

require('../src/config/env');
const { sql } = require('../src/config/db');

const migrate = async () => {
  console.log(' Starting database migration...\n');

  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;
    console.log('pgcrypto extension enabled');

    await sql`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('admin', 'user', 'store_owner');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `;
    console.log(' user_role ENUM created');

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name       VARCHAR(60)  NOT NULL CHECK (char_length(name) >= 20),
        email      VARCHAR(255) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        address    VARCHAR(400) NOT NULL,
        role       user_role    NOT NULL DEFAULT 'user',
        created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `;
    console.log(' users table created');

    await sql`
      CREATE TABLE IF NOT EXISTS stores (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name       VARCHAR(60)  NOT NULL,
        email      VARCHAR(255) NOT NULL UNIQUE,
        address    VARCHAR(400) NOT NULL,
        owner_id   UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `;
    console.log(' stores table created');

    await sql`
      CREATE TABLE IF NOT EXISTS ratings (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        store_id   UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (store_id, user_id)
      )
    `;
    console.log(' ratings table created');

    await sql`CREATE INDEX IF NOT EXISTS idx_ratings_store_id ON ratings(store_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`;
    console.log(' Indexes created');

    console.log('\n Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n Migration failed:', error);
    process.exit(1);
  }
};

migrate();
