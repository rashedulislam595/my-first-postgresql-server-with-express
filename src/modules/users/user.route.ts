import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();
// /api/v1/users
router.post('/', userController.createUser)
router.get('/', userController.getAllUser );
// todo: get single users by id
router.get('/:id', userController.getSingleUser )
router.put('/:id', userController.updateUser );
router.delete('/:id', userController.deleteUser )


export const userRoute = router;