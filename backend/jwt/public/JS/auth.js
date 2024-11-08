
function decodeJwt(token) {
    const payload = token.split('.')[1]; // Obtener la parte del payload
    const decoded = JSON.parse(atob(payload)); // Decodificar y convertir de base64 a JSON
    return decoded;
}
// Función para verificar si el usuario está autenticado
function checkAuthentication() {
    const token = sessionStorage.getItem("token_current_user");
    if (!token) {
        // Redirigir a la página de inicio de sesión si no hay token
        window.location.href = "login.html";
    }
}
checkAuthentication()