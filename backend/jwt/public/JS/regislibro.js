document.addEventListener("DOMContentLoaded", async() => {
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
    document.getElementById("regislibroForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("nombre", document.getElementById("nombrelibro").value);
        formData.append("categoria", document.getElementById("opciones").value);
        formData.append("precio", parseFloat(document.getElementById("precio").value));
        formData.append("autor", document.getElementById("autor").value);
        formData.append("sinopsis", document.getElementById("sinopsis").value);
        formData.append("imagen", document.getElementById("portada").files[0]);

        try {
            const response = await fetch("http://localhost:3000/api/v1/libros/registerlibros", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert("Libro registrado exitosamente");
                console.log(data);
            } else {
                alert("Error en el registro: " + data.msg);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Ocurrió un error al registrar el libro.");
        }
    });
});
