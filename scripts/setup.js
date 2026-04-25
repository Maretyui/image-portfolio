import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'jakob-bilder-portfolio',
    password: process.env.MYSQL_PASSWORD || 'A7f#kP9x!Q2mZr8L',
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
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const [existingAdmin] = await connection.execute(
      'SELECT id FROM admin_users WHERE username = ?',
      [adminUsername]
    );

    if (existingAdmin.length === 0) {
      await connection.execute(
        'INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)',
        [adminUsername, hashedPassword, 'admin@example.com']
      );
      console.log(`✓ Created admin user: ${adminUsername} / ${adminPassword}`);
      console.log('⚠️  IMPORTANT: Change the admin password after logging in!');
    } else {
      console.log('✓ Admin user already exists');
    }

    console.log('\n✅ Database setup complete!');
    console.log('\nYou can now log in to the admin dashboard at /admin/login');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

setupDatabase();
