import { db } from '../database/connection.database.js';

const getAllCategorias = async() =>{
    const result = await db.query('SELECT * FROM categoria'); // Consulta para obtener todas las categorías
    return result.rows;
};

export const categoriaModel = {
    getAllCategorias
}
