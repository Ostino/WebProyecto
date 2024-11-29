import { carritoModel } from "../models/carrito.model.js";
import { getUserIdFromToken } from "../middlewares/jwt.middleware.js";

const añadiraCarrito = async (req, res) => {
    const { idLibro  } = req.body;
    const cantidad =1;
    const userId = getUserIdFromToken(req);

    console.log(`User ID: ${userId}`);
    console.log(`Book ID: ${idLibro}`);
    console.log(`Cantidad: ${cantidad}`);

    if (!idLibro || !cantidad) {
        console.error("Faltan datos para añadir el libro al carrito.");
        return res.status(400).json({ message: 'Faltan datos para añadir el libro al carrito.' });
    }

    try {
        let cart = await carritoModel.getCarritoByUserId(userId);
        
        if (!cart) {
            
            console.log("No se encontró el carrito, creando uno nuevo...");
            cart = await carritoModel.createCarrito(userId);
            console.log(`Carrito creado:`, cart);
            await carritoModel.addACarritoOActualizar(cart, idLibro, cantidad);
        } else {
            console.log(`Carrito encontrado:`, cart.idcarrito);
            await carritoModel.addACarritoOActualizar(cart.idcarrito, idLibro, cantidad);
        }
        console.log(`ID del carrito que se pasará: ${cart.idcarrito}`);
    
        return res.status(200).json({ message: 'Libro añadido al carrito correctamente.' });
    } catch (error) {
        console.error("Error al añadir al carrito:", error);
        return res.status(500).json({ message: 'Error al añadir al carrito.' });
    }
};
const getCarritoResumen = async (req, res) => {
    console.log("LLEGUE AL CART SUMMARY");
    try {
        const userId = getUserIdFromToken(req);
        const cart = await carritoModel.getCarritoByUserId(userId);
        if (!cart) {
            return res.status(404).json({ message: 'No se encontró el carrito para el usuario.' });
        }
        
        const cartId = cart.idcarrito;
        console.log("cartId :", cartId);
        const total = await carritoModel.getCarritoTotal(cartId);
        console.log("total :", total);
        const details = await carritoModel.getCarritoDetallado(cartId);
        console.log("details :", details);

        res.status(200).json({ total, details });
    } catch (error) {
        console.error('Error al obtener el resumen del carrito:', error);
        res.status(500).json({ error: 'Error al obtener el resumen del carrito' });
    }
};
const removerDelCarrito = async (req, res) => {
    const { idLibro } = req.params;

    const userId = getUserIdFromToken(req);
    console.log("ENTRE A REMOVE FROM CARRITO y este es el idlibro",idLibro)
    try {
        const cart = await carritoModel.getCarritoByUserId(userId);
        if (!cart) {
            console.log('No se encontró el carrito para el usuario.');
            return res.status(404).json({ message: 'No se encontró el carrito para el usuario.' });
        }
        console.log("Carrito obtenido:", cart);
        console.log("TODO ESTA SALIENDO BIEN ESTOY POR BORRAR EL ITEM DEL CARRITO")
        console.log("VOY A BORRAR EL LIBRO DEL DETALLE CARITO NUUUMERO",cart.idcarrito," Y EL LIBRO ID",idLibro)
        await carritoModel.removerLibroDelCarrito(cart.idcarrito, idLibro);
        res.status(200).json({ message: 'Libro eliminado del carrito' });
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar del carrito' });
    }
};
const removeUnidadDelCarrito = async (req, res) => {
    const { idLibro } = req.body;
    const userId = getUserIdFromToken(req);

    if (!idLibro) {
        return res.status(400).json({ message: 'Falta el ID del libro para eliminar una unidad del carrito.' });
    }
    try {
        const cart = await carritoModel.getCarritoByUserId(userId);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }

        const result = await carritoModel.removerUnidadDelCarrito(cart.idcarrito, idLibro);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Libro no encontrado en el carrito.' });
        }

        return res.status(200).json({ message: 'Unidad del libro eliminada del carrito correctamente.' });
    } catch (error) {
        console.error("Error al eliminar una unidad del carrito:", error);
        return res.status(500).json({ message: 'Error al eliminar una unidad del carrito.' });
    }
};
const finalizarCompra= async(req,res)=>{
    try{
    const userId = getUserIdFromToken(req);
    const cart = await carritoModel.getCarritoByUserId(userId);
    await carritoModel.setCarritoEstadoFalse(cart.idcarrito)
    res.status(200).json({ message: 'Compra finalizada con éxito' });
    }catch (error) {
        console.error('Error al finalizar la compra', error);
        res.status(500).json({ error: 'Error al finalizar la compra' });
    }
}
const getPedidosByUserId= async(req,res)=>{
    try{
    const userId = getUserIdFromToken(req);
    const cart = await carritoModel.getPedidosByUserId(userId);
    res.status(200).json({ cart });
    }catch (error) {
        console.error('Error al traer los pedidos', error);
        res.status(500).json({ error: 'Error al traer los pedidos' });
    }
}
const getAllPedidos= async(req,res)=>{
    try{
    const cart = await carritoModel.getAllPedidos();
    res.status(200).json({ cart });
    }catch (error) {
        console.error('Error al traer todos los pedidos', error);
        res.status(500).json({ error: 'Error al traer todos los pedidos' });
    }
}
export const carritoController = {
    getCarritoResumen,
    añadiraCarrito,
    removerDelCarrito,
    removeUnidadDelCarrito,
    finalizarCompra,
    getPedidosByUserId,
    getAllPedidos
};
