import pg from 'pg';

export const pool = new pg.Pool({

  user: 'admin',
  password: 'root',
  host: 'localhost',
  port: 5432,
  database: 'utv_production',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000

})

