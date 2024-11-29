import { db } from '../database/connection.database.js';

const createCarrito = async (idUser) => {
    const result = await db.query('INSERT INTO Carrito (idUser) VALUES ($1) RETURNING idCarrito', [idUser]);
    return result.rows[0].idcarrito;
};
const getCarritoEstado = async (idCarrito) => {
    const result = await db.query('SELECT Estado FROM Carrito WHERE idCarrito = $1', [idCarrito]);
    return result.rows[0];
};
const setCarritoEstadoFalse = async (idCarrito) => {
    const result = await db.query('UPDATE Carrito SET Estado = FALSE WHERE idCarrito = $1;', [idCarrito]);
    return result.rows[0];
};
const getCarritoByUserId = async (idUser) => {
    const result = await db.query('SELECT * FROM Carrito WHERE idUser = $1 AND Estado = true;', [idUser]);
    return result.rows[0];
};
const getPedidosByUserId = async (idUser) => {
    const result = await db.query(`
        SELECT c.idcarrito, c.created_at, l.nombre, d.cantidad
        FROM Carrito c
        JOIN detallecarrito d ON d.idcarrito = c.idcarrito
        JOIN libros l ON l.idlibro = d.idlibro
        WHERE c.idUser = $1 AND c.Estado = false;
    `, [idUser]);
    return result.rows;
};
const getAllPedidos = async () => {
    const result = await db.query(`
        SELECT c.idcarrito, c.created_at, l.nombre, d.cantidad
        FROM Carrito c
        JOIN detallecarrito d ON d.idcarrito = c.idcarrito
        JOIN libros l ON l.idlibro = d.idlibro
        WHERE c.Estado = false;
    `);
    return result.rows;
};
const getCarritoDetalle = async (cartId, bookId) => {
    const result = await db.query('SELECT * FROM DetalleCarrito WHERE idCarrito = $1 AND idLibro = $2', [cartId, bookId]);
    return result.rows[0];
};
const getCarritoTotal = async (cartId) => {
    const result = await db.query(
        `SELECT SUM(cantidad * precioUnitario) AS total 
         FROM DetalleCarrito 
         WHERE idCarrito = $1`,
        [cartId]
    );
    return result.rows[0].total || 0;
};
const getCarritoDetallado = async (cartId) => {
    const result = await db.query(
        `SELECT dc.idLibro,l.nombre, l.precio,l.idimagen ,i.imagen ,SUM(dc.cantidad) AS totalCantidad
        FROM detallecarrito dc
        JOIN 
        libros l ON dc.idLibro = l.idLibro
        JOIN 
        Imagenes i ON l.idimagen = i.idimagen -- Relación entre Libros e Imagenes
        WHERE 
        dc.idCarrito = $1 
        GROUP BY 
        dc.idLibro, l.nombre, l.precio, l.idimagen, i.imagen; -- Agrupamos por todos los campos seleccionados`,
        [cartId]
    );
    return result.rows;
};
const addLibroAlDetalle = async (cartId, bookId, quantity, unitPrice) => {
    await db.query('INSERT INTO DetalleCarrito (idCarrito, idLibro, cantidad, precioUnitario) VALUES ($1, $2, $3, $4)', [cartId, bookId, quantity, unitPrice]);
};
const getLibroPrecioById = async (bookId) => {
    console.log(bookId)
    const result = await db.query('SELECT precio FROM Libros WHERE idLibro = $1', [bookId]);
    return result.rows[0].precio; 
};
const addACarritoOActualizar = async (cartId, bookId, quantity) => {
    console.log(`Intentando añadir o actualizar libro en el carrito...`);
    console.log(`ID del carrito: ${cartId}, ID del libro: ${bookId}, Cantidad: ${quantity}`);

    const existingBook = await getCarritoDetalle(cartId, bookId);
    
    console.log(`Libro existente en carrito:`, existingBook);

    if (existingBook) {
        const newQuantity = existingBook.cantidad + quantity; 
        console.log(`El libro ya existe en el carrito. Cantidad actual: ${existingBook.cantidad}. Nueva cantidad: ${newQuantity}`);
        console.log(`El libro ya existe en el carrito. idetalleecarrito: ${existingBook.iddetallecarrito}.`);
        try {
            await db.query(
                'UPDATE DetalleCarrito SET cantidad = $1 WHERE idDetalleCarrito = $2',
                [newQuantity, existingBook.iddetallecarrito]
            );
            console.log(`Actualizada la cantidad del libro con ID ${bookId} a ${newQuantity} en el carrito.`);
            return { updated: true, newQuantity };
        } catch (error) {
            console.error("Error al actualizar la cantidad en la base de datos:", error);
            throw new Error('Error al actualizar la cantidad en el carrito.');
        }
    } else {
        const unitPrice = await getLibroPrecioById(bookId);
        
        if (!unitPrice) {
            console.error(`No se pudo obtener el precio del libro con ID ${bookId}`);
            throw new Error(`No se pudo obtener el precio del libro con ID ${bookId}`);
        }
        
        console.log(`El libro no está en el carrito. Añadiendo libro con precio unitario: ${unitPrice}`);
        
        try {
            await addLibroAlDetalle(cartId, bookId, quantity, unitPrice);
            console.log(`Libro con ID ${bookId} añadido al carrito por primera vez.`);
            return { added: true, quantity };
        } catch (error) {
            console.error("Error al añadir el libro al carrito:", error);
            throw new Error('Error al añadir el libro al carrito.');
        }
    }
};
const removerLibroDelCarrito = async (cartId, bookId) => {
    const query = `
        DELETE FROM DetalleCarrito
        WHERE idCarrito = $1 AND idLibro = $2
    `;
    await db.query(query, [cartId, bookId]);
};  
const removerUnidadDelCarrito = async (idCarrito, idLibro) => {
    try {
        const updateQuery = `
            UPDATE DetalleCarrito 
            SET cantidad = cantidad - 1 
            WHERE idCarrito = $1 AND idLibro = $2 AND cantidad > 0
            RETURNING cantidad;
        `;
        await db.query(updateQuery, [idCarrito, idLibro]);
        return { success: true};
    } catch (error) {
        console.error("Error al eliminar una unidad del libro en el carrito:", error);
        throw new Error('No se pudo eliminar la unidad del libro en el carrito.');
    }
};

export const carritoModel = {
    getCarritoEstado,
    getCarritoDetallado,
    getCarritoTotal,
    getCarritoDetalle,
    getCarritoByUserId,
    getLibroPrecioById,
    createCarrito,
    addACarritoOActualizar,
    addLibroAlDetalle,
    removerLibroDelCarrito,
    removerUnidadDelCarrito,
    setCarritoEstadoFalse,
    getPedidosByUserId,
    getAllPedidos
};
