function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

document.addEventListener("DOMContentLoaded", async () => {
    const idLibro = getQueryParameter('idLibro'); 
    console.log("ID del libro:", idLibro);
    if (!idLibro) {
        alert("ID del libro no proporcionado.");
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/api/v1/libros/${idLibro}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.ok) {
            const libro = data.libro;

            document.getElementById("titulo").textContent = libro.nombre;
            document.getElementById("precio").textContent = `${libro.precio}$`;
            document.getElementById("categoria").textContent = libro.categoria;
            document.getElementById("autor").textContent = libro.autor;
            document.querySelector(".sinopsistxt").textContent = libro.sinopsis;
            document.querySelector(".imglibro").src = libro.imagen;
            console.log("Datos del libro:", data.libro);

            const addToCartButton = document.getElementById("ACarrito");
            addToCartButton.addEventListener("click", async () => {
                const cantidad = 1;
                try {
                    const token = sessionStorage.getItem("token_current_user");
                    const response = await fetch(`http://localhost:3000/api/v1/carrito/agregar`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ idLibro, cantidad }),
                    });
            
                    if (!response.ok) {
                        throw new Error(`Error al añadir al carrito: ${response.status}`);
                    }
                    const result = await response.json();
                    alert(result.message);
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
