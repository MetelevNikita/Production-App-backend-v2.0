
import dotenv from 'dotenv'
import path from 'path'
import pg from 'pg';

// 

dotenv.config({
  path: path.join(process.cwd(), '.env')
})

// 

export const pool = new pg.Pool({

  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  host: process.env.HOST_DB,
  port: process.env.PORT_DB,
  database: process.env.DATABASE_DB,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000

})

