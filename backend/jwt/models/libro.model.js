import { db } from '../database/connection.database.js';

const create = async ({ nombre, categoria, precio, autor, sinopsis, imagen }) => {
    const imagenQuery = {
        text: 'INSERT INTO Imagenes (nombreImagen, extension, imagen) VALUES ($1, $2, $3) RETURNING idImagen',
        values: [imagen.nombreImagen, imagen.extension, imagen.imagen]
    };
    try {
        const imagenResult = await db.query(imagenQuery);
        const idImagen = imagenResult.rows[0].idimagen;
        const libroQuery = {
            text: 'INSERT INTO Libros (nombre, categoria, idImagen, precio, autor, sinopsis) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            values: [nombre, categoria, idImagen, precio, autor, sinopsis]
        };

        const libroResult = await db.query(libroQuery);

        return libroResult.rows[0];
    } catch (error) {
        console.error("Error al insertar la imagen o el libro:", error.message);
        throw error;
    }
};

const findOneById = async (idLibro) => {
    if (!idLibro || isNaN(idLibro)) {
        return null; 
    }
    const query = {
        text: `
            SELECT l.*, i.nombreImagen, i.extension, i.imagen
            FROM Libros l
            LEFT JOIN Imagenes i ON l.idImagen = i.idImagen
            WHERE l.idLibro = $1
        `,
        values: [idLibro]
    };
    
    const { rows } = await db.query(query);
    
    if (rows.length > 0) {
        const libro = rows[0];

        if (libro.imagen) {
            try {
                const imageBuffer = Buffer.from(libro.imagen);
                const base64Image = imageBuffer.toString('base64');
                libro.imagen = `data:image/${libro.extension};base64,${base64Image}`;
            } catch (error) {
                console.error("Error al convertir imagen a base64:", error);
                libro.imagen = null; 
            }
        }
        return libro; 
    }
    return null; 
};

const findAll = async () => {
    const query = {
        text: `
            SELECT l.*, i.nombreImagen, i.extension, i.imagen
            FROM Libros l
            LEFT JOIN Imagenes i ON l.idImagen = i.idImagen
        `,
    };
    const { rows } = await db.query(query);
    
    rows.forEach(libro => {
        if (libro.imagen) {
            try {
                const imageBuffer = Buffer.from(libro.imagen);
                const base64Image = imageBuffer.toString('base64');
                libro.imagen = `data:image/${libro.extension};base64,${base64Image}`;
            } catch (error) {
                console.error("Error al convertir imagen a base64:", error);
                libro.imagen = null; 
            }
        }
    });
    return rows;
};
const findAllByCategoria = async(categoria)=>{
    const query = {
        text: `
            SELECT l.*, i.nombreImagen, i.extension, i.imagen
            FROM Libros l
            LEFT JOIN Imagenes i ON l.idImagen = i.idImagen
            where categoria = $1
        `, values: [categoria]
    };
    const { rows } = await db.query(query);
    
    rows.forEach(libro => {
        if (libro.imagen) {
            try {
                const imageBuffer = Buffer.from(libro.imagen);
                const base64Image = imageBuffer.toString('base64');
                libro.imagen = `data:image/${libro.extension};base64,${base64Image}`;
            } catch (error) {
                console.error("Error al convertir imagen a base64:", error);
                libro.imagen = null; 
            }
        }
    });
    return rows;
}
const updateById = async (idLibro, updatedFields) => {
    const { nombre, categoria, precio, autor, sinopsis, imagen } = updatedFields;
    
    let libroQuery = {
        text: `
            UPDATE Libros
            SET nombre = $1, categoria = $2, precio = $3, autor = $4, sinopsis = $5
            WHERE idLibro = $6
            RETURNING *
        `,
        values: [nombre, categoria, precio, autor, sinopsis, idLibro]
    };

const { rows } = await db.query(libroQuery);
    const updatedLibro = rows[0];

    if (imagen) {
        const imagenQuery = {
            text: `
                UPDATE Imagenes
                SET nombreImagen = $1, extension = $2, imagen = $3
                WHERE idImagen = $4
            `,
            values: [imagen.nombreImagen, imagen.extension, imagen.imagen, updatedLibro.idImagen]
        };
        await db.query(imagenQuery);
    }

    return updatedLibro;
};
const deleteById = async (idLibro) => {
    try {
        const getImageQuery = {
            text: 'SELECT idImagen FROM Libros WHERE idLibro = $1',
            values: [idLibro]
        };
        const imageResult = await db.query(getImageQuery);

        if (imageResult.rows.length === 0) {
            throw new Error('Libro no encontrado');
        }
        const deleteInventoryQuery = {
            text: 'DELETE FROM Inventario WHERE idLibro = $1',
            values: [idLibro]
        };
        await db.query(deleteInventoryQuery);

        const idImagen = imageResult.rows[0].idimagen;
        const deleteBookQuery = {
            text: 'DELETE FROM Libros WHERE idLibro = $1',
            values: [idLibro]
        };
        await db.query(deleteBookQuery);
        const deleteImageQuery = {
            text: 'DELETE FROM Imagenes WHERE idImagen = $1',
            values: [idImagen]
        };
        await db.query(deleteImageQuery);
        console.log(`Imagen con ID ${idImagen} eliminada correctamente`);

        return { success: true, msg: 'Libro e imagen eliminados exitosamente' };
    } catch (error) {
        console.error("Error en deleteById:", error);
        throw error;
    }
};
export const libroModel = {
    create,
    findOneById,
    findAll,
    updateById,
    deleteById,
    findAllByCategoria
};
