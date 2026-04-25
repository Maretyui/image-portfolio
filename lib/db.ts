import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST ?? 'localhost',
  port: parseInt(process.env.MYSQL_PORT ?? '3306'),
  user: process.env.MYSQL_USER ?? 'jakob-bilder-portfolio',
  password: process.env.MYSQL_PASSWORD, // required — no fallback
  database: process.env.MYSQL_DATABASE ?? 'jakob-bilder-portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function query<T>(sql: string, values?: any[]): Promise<T[]> {
  const [results] = await pool.execute(sql, values ?? [])
  return results as T[]
}

export interface Collection {
  id: number
  slug: string
  title: string
  description: string | null
  display_order: number
  created_at: Date
  updated_at: Date
}

export interface PortfolioImage {
  id: number
  collection_id: number
  title: string | null
  description: string | null
  image_url: string
  thumbnail_url: string | null
  display_order: number
  width_span: number
  height_span: number
  created_at: Date
  updated_at: Date
}
