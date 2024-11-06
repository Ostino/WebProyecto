document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:3000/api/v1/libros");
        const data = await response.json();
        console.log(data.libro); // Asegúrate de que cada objeto tenga un `idLibro`

        if (data.ok) {
            const librosContainer = document.getElementById("librosContainer");

            data.libro.forEach(libro => {
                // Crear el elemento del libro
                const libroDiv = document.createElement("div");
                libroDiv.className = "libro";
                libroDiv.innerHTML = `
                   <a href="amdtll.html?idLibro=${libro.idlibro}">
                        <img src="${libro.imagen}" alt="${libro.nombreImagen}" class="imglibro">
                    </a>
                    <h3 class="titulolibro">${libro.nombre}</h3>
                    <h3 class="precio">${libro.precio}$</h3>
                `;
                librosContainer.appendChild(libroDiv);
            });
        } else {
            console.error("Error al obtener los libros:", data.msg);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
});
