import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUserIntoDB(req.body);
        const {refreshToken} = result;
        // server theke browser cookies set 
        res.cookie("Refresh_Token",refreshToken,{
            secure:false, //? http-->false, https-->true, In production-->true
            httpOnly:true, //? prevent xxs attack
            sameSite:"lax", //? "none","strict","lax" --> protect CSRF attack
            path:'/',
            domain:"localhost" //? .example.com

        })

        res.status(200).json({
            success:true,
            message:"User login successful!!",
            data:result
        })

    } catch (error:any) {
        res.status(500).json({
            success:false,
            message:error.message,
            error:error
        })
    }
}

const generateAccessToken = async(req:Request, res:Response)=>{
    try {
        // console.log(req.cookies.Refresh_Token)
        const result = await authService.accessTokenIntoDB(req.cookies.Refresh_Token);
        res.status(201).json({
            success:true,
            message:"Access token generated Successfully!!!",
            result:result
        })
        
    } catch (error:any) {
        res.status(500).json({
            success:false,
            message:error.message,
            error:error
        })
    }
}

export const authController = {
    loginUser,
    generateAccessToken,
}