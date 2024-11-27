import { Router } from "express";
import { categoriaController } from "../controllers/categoria.controller.js"

const router = Router()

router.get('/',categoriaController.getAllCategories);
router.post('/crearCategoria',categoriaController.createCategoria);
router.put('/updateCategoria',categoriaController.updateCategoria);
router.delete('/deleteCategoria',categoriaController.deleteCategoria);

export default router;