document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("RegisForm").addEventListener("submit", async (event) => {
        event.preventDefault(); 

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value; 

        try {
            const response = await fetch("http://localhost:3000/api/v1/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({ username, password }), 
            });

            const data = await response.json(); 

            if (response.ok) {
                alert("Registro exitoso. Por favor, inicia sesión.");
                window.location.href = "Login.html"; 
            } else {
                alert(data.msg); 
            }
        } catch (error) {
            console.error("Error en la solicitud:", error); 
            alert("Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.");
        }
    });
});
