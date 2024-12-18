document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch("http://localhost:3000/api/v1/categoria");
        const categories = await response.json();

        const selectElement = document.getElementById("opciones");

        selectElement.innerHTML = '';

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.categoria;
            option.textContent = category.categoria;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
    const idLibro = new URLSearchParams(window.location.search).get('id');

    try {
        const response = await fetch(`http://localhost:3000/api/v1/libros/${idLibro}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.ok) {
            document.getElementById('nombrelibro').value = data.libro.nombre;
            document.getElementById('opciones').value = data.libro.categoria;
            document.getElementById('precio').value = data.libro.precio;
            document.getElementById('autor').value = data.libro.autor;
            document.getElementById('sinopsis').value = data.libro.sinopsis;
        } else {
            console.error("Error en la respuesta de los datos del libro:", data.msg);
        }
    } catch (error) {
        console.error("Error al obtener los detalles del libro:", error);
    }

    document.getElementById('regislibroForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombrelibro').value;
        const categoria = document.getElementById('opciones').value;
        const precio = document.getElementById('precio').value;
        const autor = document.getElementById('autor').value;
        const sinopsis = document.getElementById('sinopsis').value;

        const libroActualizado = {
            nombre,
            categoria,
            precio,
            autor,
            sinopsis
        };

        try {
            const updateResponse = await fetch(`http://localhost:3000/api/v1/libros/${idLibro}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(libroActualizado)
            });

            if (!updateResponse.ok) throw new Error(`HTTP error! status: ${updateResponse.status}`);

            const updateData = await updateResponse.json();
            if (updateData.ok) {
                alert("El libro ha sido actualizado con éxito");
                window.location.href = 'admctl.html'
            } else {
                console.error("Error al actualizar el libro:", updateData.msg);
            }
        } catch (error) {
            console.error("Error al actualizar el libro:", error);
        }
    });
});
