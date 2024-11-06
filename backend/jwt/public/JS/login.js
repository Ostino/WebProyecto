document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("LoginForm").addEventListener("submit", async (event) => {
        event.preventDefault(); 

        const username = document.getElementById("username").value; 
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:3000/api/v1/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({ username, password }), 
            });
            const data = await response.json(); 

            if (response.ok) {
                alert("Inicio de sesión exitoso");
                const token = data.msg; 
                sessionStorage.setItem("token_current_user", token); 
                
                const decodedToken = decodeJwt(token);
                const role = decodedToken.role;

                console.log("Rol del usuario:", role); 


                if (role === "2") {
                    window.location.href = "PaginaPrincipal.html"; 
                } else if (role === "1") {
                    window.location.href = "admctl.html"; 
                } else {
                    console.error("Rol no reconocido:", role); 
                }
            } else {
                alert(data.msg); 
            }
        } catch (error) {
            console.error("Error en la solicitud:", error); 
            alert("Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.");
        }
    });
});

// Función para decodificar el JWT
function decodeJwt(token) {
    const payload = token.split('.')[1]; // Obtener la parte del payload
    const decoded = JSON.parse(atob(payload)); // Decodificar y convertir de base64 a JSON
    return decoded;
}
