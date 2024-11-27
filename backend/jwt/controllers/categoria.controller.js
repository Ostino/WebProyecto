import { categoriaModel } from "../models/categoria.model.js";

const getAllCategories = async (req, res) => {
    try {
      const categoria = await categoriaModel.getAllCategorias();
      res.json(categoria); // Enviar datos en formato JSON
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener categorías' });
    }
};
const createCategoria = async (req, res) => {
  try {
    const { categoria } = req.body;
    console.log("La categoria a que llego al controller es ",categoria)
    const result = await categoriaModel.create(categoria);
    return res.json({ ok: true, msg: result });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear categorias' });
  }
};
const updateCategoria = async (req, res) => {
  try {
    const { idCategoria,categoria } = req.body;
    console.log("La categoria a que llego al controller es ",categoria,"y su id",idCategoria)
    const result = await categoriaModel.update( idCategoria,categoria );
    return res.json({ ok: true, msg: result });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
};

const deleteCategoria = async (req, res) => {
  try {
      const { idCategoria } = req.body;
      console.log("idCategoria a borrar",idCategoria)
      await categoriaModel.deletecategoria(idCategoria);
      return res.json({
          ok: true,
          msg: 'categoria eliminada exitosamente.',
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          ok: false,
          msg: 'error al intentar eliminar la categoria.',
      });
  }
};
  export const categoriaController = {
    getAllCategories,
    createCategoria,
    updateCategoria,
    deleteCategoria
  }