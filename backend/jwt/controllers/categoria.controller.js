import { categoriaModel } from "../models/categoria.model.js";

const getAllCategories = async (req, res) => {
    try {
      const categoria = await categoriaModel.getAllCategorias();
      res.json(categoria); // Enviar datos en formato JSON
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener categorías' });
    }
  };
  export const categoriaController = {
    getAllCategories
  }