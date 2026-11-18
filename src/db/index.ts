import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.connection_string
})

export const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      age INT,
      is_Active BOOLEAN DEFAULT true,

      create_at TIMESTAMP DEFAULT NOW(),
      update_at TIMESTAMP DEFAULT NOW()
    );
      `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      description TEXT,
      price NUMERIC(10,2),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `)
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles(
      id SERIAL PRIMARY KEY,
      user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      
      bio TEXT,
      address TEXT,
      phone_number VARCHAR(15),
      gender VARCHAR(15),

      create_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);

    console.log("Database connected Successfully!!")
  } catch (error) {
    console.log(error)
  }
}