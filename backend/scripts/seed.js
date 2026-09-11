/**
 * Creating an initial admin user.
 */

require('../src/config/env');
const bcrypt = require('bcryptjs');
const { sql } = require('../src/config/db');

const seed = async () => {
  console.log('Starting database seed...\n');

  try {
    const adminPassword = await bcrypt.hash('Admin@12345', 12);

    await sql`
      INSERT INTO users (name, email, password, address, role)
      VALUES (
        'System Administrator User',
        'admin@storerating.com',
        ${adminPassword},
        '123 Admin Street, System City, 00000',
        'admin'
      )
      ON CONFLICT (email) DO NOTHING
    `;
    console.log('   Admin user created');
    console.log('   Email:    admin@storerating.com');
    console.log('   Password: Admin@12345');
    console.log('   Role:     admin');

    console.log('\n Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n Seed failed:', error);
    process.exit(1);
  }
};

seed();
