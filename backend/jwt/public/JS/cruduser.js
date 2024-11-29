document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
});

async function loadUsers() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/users/");
        const data = await response.json();
        if (data.ok) {
            const users = data.msg;
            const userTable = document.getElementById("userTable");

            userTable.innerHTML = "";

            users.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.role === '1' ? 'Administrador' : 'Usuario'}</td>
                    <td>
                        <button class="update-btn" onclick="fillFormWithUserData(${user.iduser}, '${user.username}', '${user.password}', '${user.role}')">Actualizar</button>
                        <button class="delete-btn" onclick="deleteUser(${user.iduser})">Borrar</button>
                    </td>
                `;
                userTable.appendChild(row);
            });
        } else {
            console.error("Error al cargar usuarios", data.msg);
        }
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

function fillFormWithUserData(idUser, username, password, role) {
    document.getElementById("iduser").value = idUser;
    document.getElementById("username").value = username;
    document.getElementById("password").value = password;
    document.getElementById("role").value = role;
}

async function updateUser(event) {
    event.preventDefault();

    const idUser = document.getElementById("iduser").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    console.log("Datos a actualizar:", { idUser, username, password, role });
    if (!idUser) {
        alert("Selecciona un usuario para actualizar");
        return;
    }
    try {
        const response = await fetch("http://localhost:3000/api/v1/users/updt", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idUser, username, password, role }),
        });

        const data = await response.json();
        console.log("Respuesta del servidor:", data);

        if (data.ok) {
            alert("Usuario actualizado con éxito.");
            loadUsers();
        } else {
            alert("Error al actualizar el usuario: " + data.msg);
        }
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        alert("Hubo un error al actualizar el usuario.");
    }
}

async function deleteUser(idUser) {
    if (confirm(`¿Estás seguro de que deseas borrar al usuario con ID: ${idUser}?`)) {
        try {
            const response = await fetch("http://localhost:3000/api/v1/users/dlt", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idUser }),
            });

            const data = await response.json();
            if (data.ok) {
                alert(`Usuario con ID: ${idUser} ha sido borrado.`);
                loadUsers();  
            } else {
                alert("Error al borrar el usuario.");
            }
        } catch (error) {
            console.error("Error al borrar el usuario:", error);
            alert("Hubo un error al borrar el usuario.");
        }
    }
}
