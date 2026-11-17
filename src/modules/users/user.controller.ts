import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser =async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body)

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
}

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserFromDB();

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
}

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getSingleUserFromDB(id as string)

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
}

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.updateUserFromDB(req.body,id as string)

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

}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUserFromDB(id as string);

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
}

export const userController = {
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser

}