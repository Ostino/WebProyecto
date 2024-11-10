import { Router } from "express";
import { categoriaController } from "../controllers/categoria.controller.js"

const router = Router()

router.get('/',categoriaController.getAllCategories);

export default router;