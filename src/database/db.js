import pg from 'pg';

export const pool = new pg.Pool({

  user: 'postgres',
  password: '123456Zz',
  host: 'localhost',
  port: 5432,
  database: 'telegram',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000

})

