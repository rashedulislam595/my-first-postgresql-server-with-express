import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from "../config";
import { pool } from "../db";

const auth = async(req:Request,res:Response,next:NextFunction)=>{
    // todo: check token ase ki nah. 
    // console.log(req.headers.authorization)
    const token = req.headers.authorization;
    if(!token){
        res.status(401).json({
            success:false,
            message:"Unauthorized access!!"
        })
    }
    // todo: verify token
    const decode = jwt.verify(token as string,config.secret_key) as JwtPayload;
    // console.log(decode)

    // todo: check if the user exists
    const user = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `,[decode.email])
    
    if(user.rowCount === 0){
        res.status(404).json({
            success:false,
            message:"User not found!!"
        })
    }

    // todo: check active status
    if(!user.rows[0].is_active){
        res.status(403).json({
            success:false,
            message:"Forbidden!!"
        })
    }

    next()
}

export default auth;