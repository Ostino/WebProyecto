import { Router } from "express";
import { carritoController } from "../controllers/carrito.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get('/total', verifyToken, carritoController.getCarritoResumen);
router.delete('/remove/:idLibro', verifyToken, carritoController.removerDelCarrito);
router.post('/agregar', verifyToken, carritoController.añadiraCarrito);
router.post('/eliminaruno', verifyToken, carritoController.removeUnidadDelCarrito);

export default router;
