function displayUserLink() {
    const token = sessionStorage.getItem("token_current_user");

    // Función para decodificar el token
    function decodeToken(token) {
        const payloadBase64 = token.split('.')[1];
        return JSON.parse(atob(payloadBase64)); // Decodificar y parsear JSON
    }

    // Selecciona el enlace con la clase 'homepage'
    const homepageLink = document.querySelector("a.homepage");

    if (homepageLink) {  // Verifica que el enlace existe
        if (token) {
            try {
                const { username } = decodeToken(token); // Extraer el username
                homepageLink.textContent = `⌂ (${username})`; // Actualizar el texto del enlace
            } catch (error) {
                console.error("Error al decodificar el token:", error);
            }
        } else {
            homepageLink.textContent = "⌂"; // Si no hay token, dejar el texto por defecto
        }
    }
}

// Llama a la función para actualizar el enlace
displayUserLink();
