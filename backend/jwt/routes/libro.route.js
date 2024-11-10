import { Router } from "express";
import { libroController } from "../controllers/libro.controller.js"
import upload from '../middlewares/multer.config.js';

const router = Router()

router.post('/registerlibros',upload.single('imagen'), libroController.registerlibro); 
router.get('/', libroController.getAlllibros); 
router.get('/ctg/:categoria', libroController.getAlllibrosByCategoria);
router.get('/:idLibro', libroController.getlibroById); 
router.put('/:idLibro', upload.single('imagen'), libroController.updateLibroById);
router.delete('/:idLibro', libroController.deleteLibroById);
export default router;
