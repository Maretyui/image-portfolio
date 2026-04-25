import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'jakob-bilder-portfolio',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'jakob-bilder-portfolio',
});

console.log('[v0] Connected to MySQL');

await connection.execute(`
  CREATE TABLE IF NOT EXISTS collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    year INT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);

console.log('[v0] Created collections table');

await connection.execute(`
  CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    collection_id INT NOT NULL,
    url VARCHAR(512) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    width INT,
    height INT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
  )
`);

console.log('[v0] Created images table');

await connection.execute(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);

console.log('[v0] Created admin_users table');

await connection.execute(`
  INSERT IGNORE INTO collections (slug, title, description, year, featured) VALUES
  ('vietnam', 'Photographer Based in Vietnam', 'Editorial and commercial photography from Vietnam', 2024, true),
  ('wildlife', 'Wildlife Conservation', 'Conservation and documentary photography', 2024, false),
  ('editorial', 'Editorial Features', 'Magazine and newspaper features', 2023, false)
`);

console.log('[v0] Inserted sample collections');

await connection.end();
console.log('[v0] Migration complete');
