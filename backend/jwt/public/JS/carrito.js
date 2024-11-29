document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
    document.getElementById("listalibros").addEventListener("click", (event) => {
        const target = event.target;
        console.log("Elemento clicado:", target);
    
        const eliminarButton = target.closest(".eliminar");
        
        if (eliminarButton) {
            console.log("Botón 'Eliminar' clicado. Buscando ID del libro...");
            

            const libroElement = eliminarButton.closest(".libro");
            if (!libroElement) {
                console.warn("No se encontró el contenedor '.libro'.");
                return; 
            }
    
            const idLibro = libroElement.dataset.idLibro;
            console.log("ID del libro detectado:", idLibro); 
            
            
            eliminarDelCarrito(idLibro);
        } else {
            console.log("Elemento clicado no es un botón 'eliminar'.");
        }
    
        
        if (target.tagName === "BUTTON") {
            const libroElement = target.closest(".libro");
            if (!libroElement) {
                console.warn("No se encontró el contenedor '.libro' para el botón.");
                return;
            }
    
            const idLibro = libroElement.dataset.idLibro;
            const cantidadTexto = libroElement.querySelector(".cantidad-texto");
            let cantidadActual = parseInt(cantidadTexto.innerText);
    
            if (target.id === "MAS") {
                console.log("Botón 'MAS' clicado. Aumentando cantidad...");
                actualizarCantidad(idLibro, "MAS");
            } else if (target.id === "MENOS" && cantidadActual > 1) {
                console.log("Botón 'MENOS' clicado. Disminuyendo cantidad...");
                actualizarCantidad(idLibro, "MENOS");
            }
        }
    });
    
});

async function cargarCarrito() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/carrito/total", {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token_current_user")}`
            }
        });

        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const { total, details } = await response.json();
        console.log("Datos del carrito recibidos:", details);

        const listalibros = document.getElementById("listalibros");
        listalibros.innerHTML = "";

        details.forEach((detalle) => {
            
            const idLibro = detalle.idlibro;
            const totalCantidad = detalle.totalcantidad;
            const precioUnitario = detalle.precio;
            const titulo = detalle.nombre;
            const imagen = detalle.imagen;

            let base64Image = '';
            if (imagen && imagen.data) {
                try {
                    
                    base64Image = `data:image/png;base64,${btoa(new Uint8Array(imagen.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`;
                } catch (error) {
                    console.error("Error al procesar la imagen:", error);
                }
            }

            const libroHTML = `
                <div class="libro" data-id-libro="${idLibro}">
                    <img src="${base64Image}" alt="${titulo}">
                    <div class="info-producto">
                        <h2 class="titulolibro">${titulo}</h2>
                        <p class="preciou">$${precioUnitario}</p>
                        <div class="cantidad">
                            <button class="MENOS" id="MENOS">-</button>
                            <span class="cantidad-texto">${totalCantidad}u</span>
                            <button class="MAS" id="MAS">+</button>
                        </div>
                    </div>
                    <div class="precio">$${totalCantidad * precioUnitario}</div>
                    <button class="eliminar">
                        <img src="/Imagenes/basurero.png" alt="Eliminar">
                    </button>
                </div>
            `;
            listalibros.insertAdjacentHTML("beforeend", libroHTML);
        });

        actualizarResumen(total);
        const botonFinalizar = document.getElementById("FinalizarCompra");
        if (botonFinalizar) {
            console.log("Botón 'FinalizarCompra' asignado en cargarCarrito");
            botonFinalizar.addEventListener("click", finalizarCompra);
        } else {
            console.error("Botón 'FinalizarCompra' no encontrado después de cargarCarrito");
        }
    } catch (error) {
        console.error("Error al cargar el carrito:", error);
    }
}
async function actualizarCantidad(idLibro, Operacion) {
    try {
        let url = "";
        if (Operacion === "MAS") {
            url = `http://localhost:3000/api/v1/carrito/agregar`;
        } else if (Operacion === "MENOS") {
            url = `http://localhost:3000/api/v1/carrito/eliminaruno`;
        }
        console.log("Se esta haciendo el fetch a ",url)
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token_current_user")}`
            },
            body: JSON.stringify({ idLibro })
        });

        if (response.ok) {
            cargarCarrito();
        } else {
            console.error("Error al actualizar la cantidad.");
        }
    } catch (error) {
        console.error("Error al actualizar la cantidad:", error);
    }
}
async function eliminarDelCarrito(idLibro) {
    try {
        console.log("Intentando eliminar el libro con ID:", idLibro); 
        
        const response = await fetch(`/api/v1/carrito/remove/${idLibro}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token_current_user")}`
            }
        });

        console.log("Respuesta de la API:", response); 

        if (response.ok) {
            console.log("Libro eliminado correctamente del carrito.");
            cargarCarrito();
        } else {
            console.error("Error al eliminar el libro del carrito. Respuesta no ok:", response.status);
            const errorResponse = await response.json();
            console.error("Detalles del error:", errorResponse);
        }
    } catch (error) {
        console.error("Error al eliminar el libro del carrito:", error);
    }
}

function actualizarResumen(total) {
    const resumenContainer = document.querySelector(".resumen-pedido");
    const envio = 5; 
    const impuesto = 2; 

    const totalNum = parseFloat(total) || 0; 
    const envioNum = parseFloat(envio) || 0; 
    const impuestoNum = parseFloat(impuesto) || 0; 

    const totalGeneral = totalNum + envioNum + impuestoNum;

    resumenContainer.innerHTML = `
        <h3>Resumen de pedido</h3>
        <p>Subtotal: $${totalNum.toFixed(2)}</p>
        <p>Envío: $${envioNum.toFixed(2)}</p>
        <p>Impuesto: $${impuestoNum.toFixed(2)}</p>
        <p>Total: $${totalGeneral.toFixed(2)}</p>
        <button class="pago" id="FinalizarCompra" >Proceder con el pago</button>
    `;
} 
async function finalizarCompra() {
    console.log("finalizarCompra ejecutada");

    try {
        const response = await fetch('http://localhost:3000/api/v1/carrito/finalizar', {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token_current_user")}`
            }
        });

        if (!response.ok) {
            throw new Error("Error al finalizar la compra");
        }
        alert("¡Compra realizada con éxito!");
        console.log("Compra finalizada con éxito");
        location.reload();
    } catch (error) {
        console.error("Error al finalizar la compra:", error);
    }
}