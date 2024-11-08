document.addEventListener("DOMContentLoaded", async () => {
    try {
        
        const response = await fetch("http://localhost:3000/api/v1/carrito/allpedidos", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Estado de la respuesta:", response.status);

        if (response.status === 401) {
            console.error("Error 401: Usuario no autorizado. Verifica el token.");
            return;
        }

        const data = await response.json();
        console.log("Datos recibidos:", data);

        // Verificar si 'data.cart' es un array
        if (!Array.isArray(data.cart)) {
            console.error("La propiedad 'cart' no es un array. Recibido:", data.cart);
            return;
        }

        const pedidos = data.cart; // Accedemos al array de productos en la propiedad 'cart'

        if (!pedidos || pedidos.length === 0) {
            console.error("No se encontraron pedidos en la respuesta.");
            return;
        }

        console.log("Pedidos:", pedidos);

        const ordersContainer = document.querySelector(".orders");

        // Eliminar los placeholdes previos antes de cargar los nuevos datos
        ordersContainer.innerHTML = "";

        const orders = {};

        // Agrupar productos por idcarrito
        for (let pedido of pedidos) {
            const { idcarrito, created_at, nombre, cantidad } = pedido;

            console.log("Procesando pedido:", pedido);

            // Si el carrito no existe en el objeto orders, lo creamos
            if (!orders[idcarrito]) {
                orders[idcarrito] = {
                    fecha: created_at.split("T")[0], // Tomamos solo la fecha
                    productos: [],
                };
            }

            // Agregamos el producto al carrito correspondiente
            orders[idcarrito].productos.push({
                nombre: nombre,
                cantidad: cantidad,
            });
        }

        console.log("Pedidos agrupados:", orders);

        // Crear y añadir cada pedido al HTML
        Object.keys(orders).forEach((idcarrito) => {
            const order = orders[idcarrito];
            const orderCard = document.createElement("div");
            orderCard.className = "order-card";

            // Construir la estructura HTML para cada pedido
            orderCard.innerHTML = `
                <div class="order-header">
                    <p>Pedido n°${idcarrito} - Fecha: ${order.fecha}</p>
                </div>
                <div class="order-body">
                    <div class="order-info">
                        ${order.productos.map((producto) => `<p> ${producto.nombre}</p>`).join("")}
                    </div>
                    <div class="order-quantities">
                        ${order.productos.map((producto) => `<p> ${producto.cantidad} U</p>`).join("")}
                    </div>
                </div>
            `;

            ordersContainer.appendChild(orderCard);
        });
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
});
