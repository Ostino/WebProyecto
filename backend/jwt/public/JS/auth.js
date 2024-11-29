
function decodeJwt(token) {
    const payload = token.split('.')[1]; 
    const decoded = JSON.parse(atob(payload)); 
    return decoded;
}
function checkAuthentication() {
    const token = sessionStorage.getItem("token_current_user");
    if (!token) {
        window.location.href = "login.html";
    }
}
checkAuthentication()