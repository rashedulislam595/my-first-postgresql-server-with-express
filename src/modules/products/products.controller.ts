import type { Request, Response } from "express";
import { productsService } from "./products.service";
import sendResponse from "../../utils/sendResponse";

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const result = await productsService.getAllProductsIntoDB()

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Products retrieve successfully!!",
            data: result.rows
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

const getSingleProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await productsService.getSingleProductsIntoDB(id as string)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Product retrieve successfully!!",
            data: result.rows[0]
        })

        if (result.rowCount === 0) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "product not found!!"
            })
        }

    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error
        })
    }
}

const createProduct = async (req: Request, res: Response) => {
    try {
        const result = await productsService.createProductIntoDB(req.body)

        if (result.rowCount === 0) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "product not found!!"
            })
        }
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Product created successfully!!",
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

const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await productsService.updateProductIntoDB(req.body, id as string);

        if (result.rowCount === 0) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "product not found!!"
            })
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "product updated successfully!!",
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

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await productsService.deletePRoductIntoDB(id as string);

        if (result.rowCount === 0) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "product not found!!😛"
            })
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Product deleted successful!!"
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

export const productsController = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct
}