import { pool } from "../../db";
import type { IProfile } from "./user.interface";

const createProfileIntoDB=async(payload:IProfile)=>{
    const {user_id,bio,address,phone_number,gender} = payload;

    const user = await pool.query(`
        SELECT * FROM users WHERE id=$1
        `,[user_id]);
    if(user.rowCount === 0){
        throw new Error("User not exists in the database!!");
    }

    const result = await pool.query(`
        INSERT INTO profiles (user_id,bio,address,phone_number,gender)
        VALUES($1,$2,$3,$4,$5) RETURNING *
        `,[user_id,bio,address,phone_number,gender]);
        return result
}

export const profileService ={
    createProfileIntoDB,
}