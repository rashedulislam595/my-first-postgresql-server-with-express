import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body)

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully!!",
      data: result.rows[0]
    })
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error
    })
  }
}

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserFromDB();

    // console.log(result)
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users retrieve successfully!!",
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
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found!"
      })
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User retrieve successfully!!",
      data: result.rows[0]
    })
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error
    })
  }
}

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.updateUserFromDB(req.body, id as string)

    // todo: user not found
    if (result.rowCount === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found!"
      })
    }

    delete result.rows[0].password;
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User updated successfully!!",
      data: result.rows[0]
    })

  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
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
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found!!",
      })
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User deleted successful!!",
      data: result.rows[0]
    })
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
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