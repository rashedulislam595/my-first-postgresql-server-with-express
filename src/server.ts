// const express = require('express');
import express, { type Application, type Request, type Response } from 'express'
import { Pool } from "pg"
import config from './config';
const app: Application = express()


app.use(express.json())
// app.use(express.text());
// app.use(express.urlencoded({extended:true}))

const pool = new Pool({
  connectionString: config.connection_string
})

const initDB = async () => {
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

    console.log("Database connected Successfully!!")
  } catch (error) {
    console.log(error)
  }
}

initDB();

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "Rashed"
  })
})

app.post('/api/v1/users', async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;
    const result = await pool.query(`
      INSERT INTO users (name,email,password,age) VALUES ($1,$2,$3,$4) RETURNING *
      `, [name, email, password, age])

    // console.log(result)

    res.status(201).json({
      success: true,
      message: "User created!!",
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      massage: error?.message,
      error: error
    })
  }
})

app.get('/api/v1/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `)

    // console.log(result)
    res.status(200).json({
      success: true,
      message: "Users retrieve Successful!!",
      data: result.rows
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error
    })
  }
})

// todo: get single users by id
app.get('/api/v1/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT * FROM users WHERE id = $1
      `, [id]);
    // console.log(result)

    // todo: user not found
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!"
      })
    }

    res.status(200).json({
      success: true,
      message: "User retrieve successful!",
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error
    })
  }
})

// todo: update user
app.put('/api/v1/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, password, age, is_Active } = req.body;

    const result = await pool.query(`
      UPDATE users
      SET
      name= COALESCE($1,name),
      password= COALESCE($2,password),
      age= COALESCE($3,age),
      is_Active= COALESCE($4,is_Active),
      update_at = NOW()

      WHERE id = $5 RETURNING *
      `, [name ?? null, password ?? null, age ?? null, is_Active ?? null, id]);

    // todo: user not found
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!"
      })
    }

    res.status(200).json({
      success: true,
      message: "User updated successful!!",
      data: result.rows[0]
    })

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    })
  }

})

// todo: delete user
app.delete('/api/v1/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      DELETE FROM users WHERE id=$1
      `, [id])
    // todo: user not found
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!"
      })
    }

    res.status(200).json({
      success: true,
      message: "User deleted successful!!"
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    })
  }
})


//! products

app.get("/api/v2/products",async(req:Request,res:Response)=>{
  try {
    const result = await pool.query(`
    SELECT * FROM products
    `)
    res.status(200).json({
    success:true,
    message:"Products retrieve successful!!",
    data:result.rows
    })
  } catch (error:any) {
    res.status(500).json({
    success:false,
    message:error.message,
    error:error
    })
  }
})

//todo: get single product
app.get('/api/v2/products/:id',async(req:Request,res:Response)=>{
  try {
  const {id} = req.params;
  const result = await pool.query(`
  SELECT * FROM products WHERE id = $1
  `,[id])
  res.status(200).json({
  success:true,
  message:"Product retrieve successful!!",
  data:result.rows[0]
  })
    
  } catch (error:any) {
    res.status(500).json({
    success:false,
    message:error.message,
    error: error
    })
  }
})

// todo: product create
app.post("/api/v2/products", async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;
    const result = await pool.query(`
      INSERT INTO products (name,description,price)
      VALUES($1,$2,$3) RETURNING *
    `, [name, description, price]);

    res.status(201).json({
    success:true,
    message:"Product created successful!!",
    data: result.rows[0]
    })
  } catch (error:any) {
    res.status(500).json({
    success:false,
    message:error.message,
    error:error
    })
  }
})

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})