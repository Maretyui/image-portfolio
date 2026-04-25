import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  if (!process.env.MYSQL_PASSWORD) {
    console.error('❌ MYSQL_PASSWORD environment variable is required. Set it in .env.local and re-run.');
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'jakob-bilder-portfolio',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'jakob-bilder-portfolio',
  });

  try {
    console.log('Running database migrations...');

    const sqlFile = path.join(process.cwd(), 'scripts', 'init-db.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    const statements = sql.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      await connection.execute(statement);
    }

    console.log('✓ Database schema created');

    const adminUsername = 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const [existingAdmin] = await connection.execute(
      'SELECT id FROM admin_users WHERE username = ?',
      [adminUsername]
    );

    if (existingAdmin.length === 0) {
      await connection.execute(
        'INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)',
        [adminUsername, hashedPassword, 'admin@example.com']
      );
      console.log(`✓ Created admin user: ${adminUsername}`);
      console.log(`  Password: ${adminPassword}`);
      console.log('  Save this password — it will not be shown again.');
    } else {
      console.log('✓ Admin user already exists, skipping creation');
    }

    console.log('\n✅ Database setup complete!');
    console.log('Log in at /admin/login');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

setupDatabase();
