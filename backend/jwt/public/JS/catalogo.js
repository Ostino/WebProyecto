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
                   <a href="Detalle.html?idLibro=${libro.idlibro}">
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
    try {
        const response = await fetch("http://localhost:3000/api/v1/categoria");
        const categories = await response.json();
        const categoryButtonsContainer = document.getElementById("category-buttons");

        categories.forEach(category => {
            const button = document.createElement("button");
            button.textContent = category.categoria;

            // Evento para recargar la página con la categoría seleccionada en la URL
            button.addEventListener("click", () => {
                const selectedCategory = category.categoria;
                window.location.href = `?categoria=${encodeURIComponent(selectedCategory)}`;
            });

            categoryButtonsContainer.appendChild(button);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }

    // Obtener el parámetro de categoría de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaSeleccionada = urlParams.get('categoria');

    // Si hay una categoría seleccionada, cargar libros de esa categoría
    if (categoriaSeleccionada) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/libros/ctg/${categoriaSeleccionada}`);
            const data = await response.json();

            if (data.ok) {
                const librosContainer = document.getElementById("librosContainer");
                librosContainer.innerHTML = ''; // Limpiar contenido previo

                data.libro.forEach(libro => {
                    const libroDiv = document.createElement("div");
                    libroDiv.className = "libro";
                    libroDiv.innerHTML = `
                        <a href="Detalle.html?idLibro=${libro.idlibro}">
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
            console.error("Error en la solicitud de libros:", error);
        }
    }
});
