import { db } from '../database/connection.database.js';

const getAllCategorias = async() =>{
    const result = await db.query('SELECT * FROM categoria'); 
    return result.rows;
};
const create = async(categoria) =>{
    console.log("La categoria a que llego al model es ",categoria)
    const result = {
        text: 'INSERT INTO categoria (categoria) VALUES ($1) RETURNING categoria',
        values: [categoria]
    };
    const{rows}=await db.query(result)
    return rows[0]
};

const update = async(idCategoria,Categoria) =>{
    console.log("La categoria a que llego al model es ",Categoria,"y su id",idCategoria)
    const query={
        text: 
        'UPDATE categoria SET categoria = $2 WHERE idCategoria = $1;',
        values:[idCategoria,Categoria]
    }
    const{rows}=await db.query(query)
    if (rows.length === 0) {
        console.log("No hay categoria para actualizar")
        return null;
    }
    return rows[0]
}
const deletecategoria = async (idCategoria) => {
    try {
        const query = {
            text: 'DELETE FROM Categoria WHERE idCategoria = $1;',
            values: [idCategoria],
        };
        const result = await db.query(query);
        if (result.rowCount === 0) {
            console.log("No se elimino ninguna Categoria")
            return null; 
        }
        console.log("Se elimino la categoria")
        return true;
    } catch (error) {
        console.error('Error al eliminar la categoria:', error);
        throw new Error('Error en la base de datos');
    }
};

export const categoriaModel = {
    getAllCategorias,
    create,
    update,
    deletecategoria
}
