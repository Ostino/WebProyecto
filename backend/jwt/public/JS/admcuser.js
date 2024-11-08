function displayUserLink() {
    const token = sessionStorage.getItem("token_current_user");

    // Función para decodificar el token
    function decodeToken(token) {
        const payloadBase64 = token.split('.')[1];
        return JSON.parse(atob(payloadBase64)); // Decodificar y parsear JSON
    }
    const homepageLink = document.querySelector("a.homepage");
    const loginButton = document.getElementById("loginButton");
    const regisButton = document.getElementById("regisButton");
    if (token) {
        try {
            const { username } = decodeToken(token); // Extraer el username

            // Actualizar enlace de homepage
            if (homepageLink) {
                homepageLink.textContent = `⌂ (${username})`;
            }
            if (loginButton) {
                loginButton.textContent = "Cerrar Sesión";
                loginButton.addEventListener("click", function () {
                    sessionStorage.removeItem("token_current_user"); // Elimina el token
                    window.location.href = "Login.html"; // Redirige al login
                });
            }
            // Actualizar botón de inicio de sesión a "Cerrar Sesión"
            if (loginButton) {
                loginButton.textContent = "Cerrar Sesión";
                loginButton.addEventListener("click", function () {
                    sessionStorage.removeItem("token_current_user"); // Elimina el token
                    window.location.href = "Login.html"; // Redirige al login
                });
            }

            // Actualizar botón de registro a "Ver pedidos"
            if (regisButton) {
                regisButton.textContent = "Ver pedidos";
                regisButton.parentElement.href = "admhp.html";
            }
        } catch (error) {
            console.error("Error al decodificar el token:", error);
        }
    } else {
        // Si no hay token, mostrar los textos y enlaces por defecto
        if (homepageLink) homepageLink.textContent = "⌂";
        if (loginButton) {
            loginButton.textContent = "Iniciar Sesión";
            loginButton.parentElement.href = "Login.html"; // Enlace al login
        }
        if (regisButton) {
            regisButton.textContent = "Registrarse";
            regisButton.parentElement.href = "Registrarse.html"; // Enlace al registro
        }
    }
}
displayUserLink();
