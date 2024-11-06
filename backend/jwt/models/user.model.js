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
export const UserModel = {
    create,
    findOneByUsername,
    findAll
    
}