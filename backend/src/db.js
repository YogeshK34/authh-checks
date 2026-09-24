import { Pool } from "pg";

export const pool = await new Pool({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '123456',
    database: 'auth-db'
})