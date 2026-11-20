import express, { type Application, type Request, type Response } from 'express'
import { pool } from './db';
import { userRoute } from './modules/users/user.route';
import { profileRoute } from './modules/profiles/profile.route';
import { authRouter } from './modules/auth/auth.route';
import logger from './middleware/logger';
const app: Application = express()


// custom middleware

app.use(express.json())
app.use(express.text());
app.use(express.urlencoded({extended:true}))
app.use(logger)


app.use("/api/v1/users",userRoute);
app.use("/api/v1/profiles",profileRoute);
app.use("/api/v1/auth",authRouter)

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "Rashed"
  })
})

//! products

app.get("/api/v2/products", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
    SELECT * FROM products
    `)
    res.status(200).json({
      success: true,
      message: "Products retrieve successful!!",
      data: result.rows
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    })
  }
})

//todo: get single product
app.get('/api/v2/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
  SELECT * FROM products WHERE id = $1
  `, [id])
    res.status(200).json({
      success: true,
      message: "Product retrieve successful!!",
      data: result.rows[0]
    })

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "product not found!!",
      })
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
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

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "product not found!!",
      })
    }

    res.status(201).json({
      success: true,
      message: "Product created successful!!",
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

app.put('/api/v2/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const result = await pool.query(`
      UPDATE products 
      SET 
      name = COALESCE($1,name),
      description = COALESCE($2,description),
      price = COALESCE($3,price),
      updated_at = NOW()
      WHERE id = $4 RETURNING *
      `, [name ?? null, description ?? null, price ?? null, id]);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "product not found!!",
      })
    }

    res.status(200).json({
      success: true,
      message: "product updated successful!!",
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

app.delete('/api/v2/products/:id',async(req:Request,res:Response)=>{
  try {
    const {id} = req.params;
    const result = await pool.query( `
      DELETE FROM products WHERE id=$1
      `,[id])
    
    if(result.rowCount === 0){
      res.status(404).json({
        success:false,
        message:"Product not found!!😛"
      })
    }
    
    res.status(200).json({
      success:true,
      message:"Product deleted successful!!"
    })
  } catch (error:any) {
    res.status(500).json({
      success:false,
      message:error.message,
      error:error
    })
  }
})

export default app;