import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from "../config";
import { pool } from "../db";
import type { Role } from "../types";

const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // todo: check token ase ki nah. 
            // console.log(req.headers.authorization)
            const token = req.headers.authorization;
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized access!!"
                })
            }
            // todo: verify token
            const decode = jwt.verify(token as string, config.secret_key) as JwtPayload;
            // console.log(decode)

            // todo: check if the user exists
            const user = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [decode.email])

            if (user.rowCount === 0) {
                res.status(404).json({
                    success: false,
                    message: "User not found!!"
                })
            }

            // todo: check active status
            if (!user.rows[0].is_active) {
                res.status(403).json({
                    success: false,
                    message: "Forbidden!!"
                })
            }

            if (roles.length && !roles.includes(user.rows[0].role)) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized Person!!"
                })
            }

            //todo: req ar moddhe amader user take set kore dibo.. get method a req.body undefined thake.
            //todo: user ar type ta global a express a set kore dite hobe express type namespace theke. 
            req.user = decode;
            // req ->>{body,user}
            // console.log(req)

            next()
        } catch (error) {
            next(error)
        }
    }
}

export default auth;