document.addEventListener("DOMContentLoaded", async() => {
    try {
        const response = await fetch("http://localhost:3000/api/v1/categoria"); // Cambia la URL si es necesario
        const categories = await response.json();

        // Obtener el elemento select
        const selectElement = document.getElementById("opciones");

        // Limpiar cualquier opción previa
        selectElement.innerHTML = '';

        // Crear una opción por cada categoría obtenida
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.categoria;  // Suponiendo que la propiedad de la categoría es "categoria"
            option.textContent = category.categoria; // Esto es lo que verá el usuario
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
    document.getElementById("regislibroForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(); // Crear un FormData para el envío de archivos
        formData.append("nombre", document.getElementById("nombrelibro").value);
        formData.append("categoria", document.getElementById("opciones").value);
        formData.append("precio", parseFloat(document.getElementById("precio").value));
        formData.append("autor", document.getElementById("autor").value);
        formData.append("sinopsis", document.getElementById("sinopsis").value);
        formData.append("imagen", document.getElementById("portada").files[0]); // Agregar la imagen

        try {
            const response = await fetch("http://localhost:3000/api/v1/libros/registerlibros", {
                method: "POST",
                body: formData // Usar formData en el body
            });

            const data = await response.json();

            if (response.ok) {
                alert("Libro registrado exitosamente");
                console.log(data); // Mostrar la respuesta del servidor
            } else {
                alert("Error en el registro: " + data.msg); // Mostrar el mensaje de error
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Ocurrió un error al registrar el libro.");
        }
    });
});
