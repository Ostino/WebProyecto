function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

document.addEventListener("DOMContentLoaded", async () => {
    const idLibro = getQueryParameter('idLibro');
    console.log("ID del libro:", idLibro);
    
    document.getElementById("EditarLibro").addEventListener("click", () => {
        window.location.href = `EditarLibro.html?id=${idLibro}`;
    });

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

        } else {
            alert("Error al cargar el libro.");
        }
    } catch (error) {
        console.error("Error al cargar el libro:", error);
        alert("Error al cargar el libro. Por favor, inténtelo más tarde.");
    }
    document.getElementById('BorrarLibro').addEventListener('click', async () => {
        if (confirm("¿Estás seguro de que deseas eliminar este libro? Esta acción no se puede deshacer.")) {
            try {
                const deleteResponse = await fetch(`http://localhost:3000/api/v1/libros/${idLibro}`, {
                    method: 'DELETE'
                });

                if (!deleteResponse.ok) throw new Error(`HTTP error! status: ${deleteResponse.status}`);

                const deleteData = await deleteResponse.json();
                if (deleteData.ok) {
                    alert("El libro ha sido eliminado con éxito.");
                    window.location.href = 'admctl.html';
                } else {
                    console.error("Error al eliminar el libro:", deleteData.msg);
                }
            } catch (error) {
                console.error("Error al eliminar el libro:", error);
            }
        }
    });
});
