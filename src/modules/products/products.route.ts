import { Router } from "express";
import { productsController } from "./products.controller";

const router = Router();

router.get('/',productsController.getAllProducts);
router.get("/:id",productsController.getSingleProduct);
router.post('/',productsController.createProduct);
router.put('/:id',productsController.updateProduct);
router.delete("/:id",productsController.deleteProduct)

export const productsRoute = router;