const API_URL = "http://localhost:3000/api/v1/categoria";

async function cargarCategorias() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al cargar categorías");
        
        const categorias = await response.json();
        const tablaBody = document.querySelector("#categoriasTabla tbody");
        tablaBody.innerHTML = "";

        categorias.forEach(categoria => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${categoria.idcategoria}</td>
                <td>${categoria.categoria}</td>
                <td>
                    <button class="update-btn" onclick="editarCategoria(${categoria.idcategoria}, '${categoria.categoria}')">Editar</button>
                    <button class="delete-btn" onclick="eliminarCategoria(${categoria.idcategoria})">Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    } catch (error) {
        alert("Error al cargar categorías: " + error.message);
        console.error(error);
    }
}

function editarCategoria(idCategoria, categoria) {
    document.querySelector("#idctg").value = idCategoria;
    document.querySelector("#categoria").value = categoria;
}

async function eliminarCategoria(idCategoria) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) return;

    try {
        const response = await fetch(`${API_URL}/deleteCategoria`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idCategoria })
        });

        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.msg || "Error al eliminar la categoría");

        alert("Categoría eliminada correctamente");
        cargarCategorias();
    } catch (error) {
        alert("Error al eliminar categoría: " + error.message);
        console.error(error);
    }
}

async function guardarCategoria(event) {
    event.preventDefault();

    const idCategoria = document.querySelector("#idctg").value;
    const categoria = document.querySelector("#categoria").value;

    const url = idCategoria ? `${API_URL}/updateCategoria` : `${API_URL}/crearCategoria`;
    const metodo = idCategoria ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idCategoria, categoria })
        });

        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.msg || "Error al guardar la categoría");

        alert(idCategoria ? "Categoría actualizada correctamente" : "Categoría creada correctamente");
        document.querySelector("#updateForm").reset();
        cargarCategorias();
    } catch (error) {
        alert("Error al guardar categoría: " + error.message);
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", cargarCategorias);