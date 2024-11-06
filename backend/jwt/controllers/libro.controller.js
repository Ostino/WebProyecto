import { libroModel } from "../models/libro.model.js";
//  /api/v1/libros/registerlibros
const registerlibro = async (req, res) => {
    try {
        const { nombre, categoria, precio, autor, sinopsis } = req.body;

        if (!nombre || !categoria || !precio || !autor) {
            return res.status(400).json({ ok: false, msg: 'Nombre, categoría, precio y autor son campos obligatorios' });
        }

        if (!req.file) {
            return res.status(400).json({ ok: false, msg: 'La imagen es obligatoria' });
        }

        const imagen = {
            nombreImagen: req.file.originalname,
            extension: req.file.mimetype.split('/')[1],
            imagen: req.file.buffer 
        };

        const newlibro = await libroModel.create({
            nombre,
            categoria,
            precio,
            autor,
            sinopsis,
            imagen
        });

        return res.status(201).json({ ok: true, book: newlibro, msg: 'Libro y imagen registrados exitosamente' });
    } catch (error) {
        console.error("Error en el registro del libro:", error);
        return res.status(500).json({ ok: false, msg: 'Error en el servidor' });
    }
};

const getAlllibros = async (req, res) => {
    try {
        const libro = await libroModel.findAll();
        return res.status(200).json({ ok: true, libro });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Error en el servidor' });
    }
};

const getlibroById = async (req, res) => {
    const { idLibro } = req.params;
    try {
        const libro = await libroModel.findOneById(idLibro);
        if (!libro) {
            return res.status(404).json({ ok: false, msg: "Libro no encontrado" });
        }
        ;
        return res.json({ ok: true, libro });
    } catch (error) {
        console.error("Error en getlibroById:", error);
        return res.status(500).json({ ok: false, msg: "Error en el servidor" });
    }
};
const updateLibroById = async (req, res) => {
    const { idLibro } = req.params;
    const { nombre, categoria, precio, autor, sinopsis } = req.body;
    const imagen = req.file;

    try {
        const existingLibro = await libroModel.findOneById(idLibro);
        if (!existingLibro) {
            return res.status(404).json({ ok: false, msg: "Libro no encontrado" });
        }

        const updatedFields = { nombre, categoria, precio, autor, sinopsis };

        if (imagen) {
            updatedFields.imagen = {
                nombreImagen: imagen.originalname,
                extension: imagen.mimetype.split('/')[1],
                imagen: imagen.buffer
            };
        }

        const updatedLibro = await libroModel.updateById(idLibro, updatedFields);

        return res.status(200).json({ ok: true, libro: updatedLibro, msg: "Libro actualizado exitosamente" });
    } catch (error) {
        console.error("Error en updateLibroById:", error);
        return res.status(500).json({ ok: false, msg: "Error en el servidor" });
    }
};
const deleteLibroById = async (req, res) => {
    const { idLibro } = req.params;
    try {
        const libro = await libroModel.findOneById(idLibro);
        if (!libro) {
            return res.status(404).json({ ok: false, msg: "Libro no encontrado" });
        }
        libroModel.deleteById(idLibro)
        ;
        return res.json({ ok: true, libro });
    } catch (error) {
        console.error("Error en getlibroById:", error);
        return res.status(500).json({ ok: false, msg: "Error en el servidor" });
    }
};
export const libroController = {
    registerlibro,
    getAlllibros,
    getlibroById,
    updateLibroById,
    deleteLibroById
};
