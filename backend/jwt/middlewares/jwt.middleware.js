import jwt from 'jsonwebtoken'

export const verifyToken = (req,res,next)=>{
    let token = req.headers.authorization
    if(!token){
        return res.status(401).json({error:"Token no proporcionado"})
    }
    console.log({token})
    token=token.split(" ")[1]

    try{
        const {iduser,username,role} =jwt.verify(token,"PalabraToken") 

        req.iduser = iduser
        req.username = username
        req.role = role

    next()
    }catch(error){
        return res.status(400).json({error:"Token Invalido"})
    }
}


export const getUserIdFromToken = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new Error('Token no proporcionado');
    }
    try {
        const decoded = jwt.verify(token, 'PalabraToken'); // Asegúrate de usar la misma clave secreta
        return decoded.iduser; // O el campo que contenga el ID del usuario
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        throw new Error('Token inválido');
    }
};
