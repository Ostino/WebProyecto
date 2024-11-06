// Función para obtener parámetros de la URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Espera a que el contenido del DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", async () => {
    const idLibro = getQueryParameter('idLibro'); 
    
    if (!idLibro) {
        alert("ID del libro no proporcionado.");
        return;
    }
    try {
        // Realiza una solicitud al backend para obtener el libro por su ID
        const response = await fetch(`http://localhost:3000/api/v1/libros/${idLibro}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.ok) {
            const libro = data.libro; // Accede al libro

            // Asigna los valores al HTML
            document.getElementById("titulo").textContent = libro.nombre;
            document.getElementById("precio").textContent = `${libro.precio}$`;
            document.getElementById("categoria").textContent = libro.categoria; // Asigna categoría
            document.getElementById("autor").textContent = libro.autor; // Asigna autor
            document.querySelector(".sinopsistxt").textContent = libro.sinopsis; // Asigna sinopsis
            document.querySelector(".imglibro").src = libro.imagen; // Asigna imagen
            console.log("Datos del libro:", data.libro); // Imprime los datos del libro para depuración

            const addToCartButton = document.getElementById("ACarrito"); // Asegúrate de que este ID coincida con tu HTML
            addToCartButton.addEventListener("click", async () => {
                const cantidad = 1; // Puedes cambiar esto según sea necesario
                try {
                    const token = sessionStorage.getItem("token_current_user"); // Obtener el token del local storage
                    const response = await fetch(`http://localhost:3000/api/v1/carrito/agregar`, { // Llamar a la nueva ruta
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ idLibro, cantidad }), // Enviar en el cuerpo
                    });
            
                    if (!response.ok) {
                        throw new Error(`Error al añadir al carrito: ${response.status}`);
                    }
                    const result = await response.json();
                    alert(result.message); // Mostrar mensaje de éxito
                } catch (error) {
                    console.error("Error al añadir al carrito:", error);
                    alert("Error al añadir al carrito. Por favor, inténtelo de nuevo.");
                }
            });
            
        } else {
            alert("Error al cargar el libro.");
        }
    } catch (error) {
        console.error("Error al cargar el libro:", error);
        alert("Error al cargar el libro. Por favor, inténtelo más tarde.");
    }
});
