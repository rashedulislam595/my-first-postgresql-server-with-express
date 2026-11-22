import { pool } from "../../db";
import type { IProducts } from "./product.interface";

const getAllProductsIntoDB = async()=>{
    const result = await pool.query(`
    SELECT * FROM products
    `)

    return result;
}

const getSingleProductsIntoDB= async(id:string)=>{
    const result = await pool.query(`
  SELECT * FROM products WHERE id = $1
  `, [id]);
  return result;
}

const createProductIntoDB = async(payload:IProducts)=>{
    const { name, description, price } = payload;
    const result = await pool.query(`
      INSERT INTO products (name,description,price)
      VALUES($1,$2,$3) RETURNING *
    `, [name, description, price]);
    return result;
}

const updateProductIntoDB = async(payload:IProducts,id:string) =>{
    const { name, description, price } = payload;
    const result = await pool.query(`
      UPDATE products 
      SET 
      name = COALESCE($1,name),
      description = COALESCE($2,description),
      price = COALESCE($3,price),
      updated_at = NOW()
      WHERE id = $4 RETURNING *
      `, [name ?? null, description ?? null, price ?? null, id]);

      return result;
}

const deletePRoductIntoDB = async(id:string)=>{
    const result = await pool.query( `
      DELETE FROM products WHERE id=$1
      `,[id])
    return result
}

export const productsService = {
    getAllProductsIntoDB,
    getSingleProductsIntoDB,
    createProductIntoDB,
    updateProductIntoDB,
    deletePRoductIntoDB
}