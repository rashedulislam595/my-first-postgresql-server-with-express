import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { ILogin } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB= async(payload:ILogin)=>{
    //todo: Check if the user exist
    //todo: check if the password match
    //todo: Check the user status
    //todo: If pass all then generate jwt token
    const {email,password} = payload;
    
    const user = await pool.query(`
    SELECT * FROM users WHERE email=$1    
        `,[email])
    
    if(user.rowCount === 0){
        throw new Error("Invalid Credential!!")
    }
    const matchPassword = await bcrypt.compare(password,user.rows[0].password);

    if(!matchPassword){
        throw new Error("Password is wrong!!")
    }
    if(!user.rows[0].is_active){
        throw new Error("Access Denied!!")
    }

    const jwtPayload={
        id:user.rows[0].id,
        name:user.rows[0].name,
        email:user.rows[0].email,
        is_active:user.rows[0].is_active
    }

    const accessToken = jwt.sign(jwtPayload,config.secret_key,{
        expiresIn:"1d"
    })
    // response password hide 
    delete user.rows[0].password;
    return {accessToken,user:user.rows[0]}
}

export const authService={
    loginUserIntoDB,
}