import {db} from '../database/connection.database.js'

const create = async({username,password})=>{
    const query={
        text: 
        'insert into Usuarios (username,password) values($1,$2) returning *'
        ,
        values:[username,password]
    }
    const{rows}=await db.query(query)
    return rows[0]
}
const findOneByUsername = async (username)=>{
    const query={
        text:'select * from Usuarios where username = $1',
        values:[username]
    }
    const{rows}=await db.query(query)
    return rows[0]
}

const findAll = async()=>{
    const query={
        text:'select * from Usuarios',
    }
    const{rows}=await db.query(query)
    return rows
}
const update = async({username,password,role,idUser})=>{
    console.log("IdUser del modelo",idUser)
    const query={
        text: 
        'UPDATE Usuarios SET username = $1, password = $2,role = $3 WHERE idUser = $4;',
        values:[username,password,role,idUser]
    }
    const{rows}=await db.query(query)
    if (rows.length === 0) {
        console.log("No hay usuarios para actualizar")
        return null;
    }
    return rows[0]
}
const deleteUser = async (idUser) => {
    try {
        const query = {
            text: 'DELETE FROM Usuarios WHERE idUser = $1;',
            values: [idUser],
        };
        const result = await db.query(query);
        if (result.rowCount === 0) {
            console.log("No se elimino ningun usuario")
            return null; 
        }
        console.log("Se elimino el usuario")
        return true;
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw new Error('Error en la base de datos');
    }
};

export const UserModel = {
    create,
    findOneByUsername,
    findAll,
    update,
    deleteUser
}