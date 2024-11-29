function displayUserLink() {
    const token = sessionStorage.getItem("token_current_user");

    function decodeToken(token) {
        const payloadBase64 = token.split('.')[1];
        return JSON.parse(atob(payloadBase64));
    }
    const homepageLink = document.querySelector("a.homepage");
    const loginButton = document.getElementById("loginButton");
    const regisButton = document.getElementById("regisButton");
    if (token) {
        try {
            const { username } = decodeToken(token);

            if (homepageLink) {
                homepageLink.textContent = `⌂ (${username})`;
            }
            if (loginButton) {
                loginButton.textContent = "Cerrar Sesión";
                loginButton.addEventListener("click", function () {
                    sessionStorage.removeItem("token_current_user");
                    window.location.href = "Login.html";
                });
            }

            if (loginButton) {
                loginButton.textContent = "Cerrar Sesión";
                loginButton.addEventListener("click", function () {
                    sessionStorage.removeItem("token_current_user");
                    window.location.href = "Login.html";
                });
            }

            if (regisButton) {
                regisButton.textContent = "Ver pedidos";
                regisButton.parentElement.href = "admhp.html";
            }
        } catch (error) {
            console.error("Error al decodificar el token:", error);
        }
    } else {
        if (homepageLink) homepageLink.textContent = "⌂";
        if (loginButton) {
            loginButton.textContent = "Iniciar Sesión";
            loginButton.parentElement.href = "Login.html";
        }
        if (regisButton) {
            regisButton.textContent = "Registrarse";
            regisButton.parentElement.href = "Registrarse.html";
        }
    }
}
displayUserLink();
