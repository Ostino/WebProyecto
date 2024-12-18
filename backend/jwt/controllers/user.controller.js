import jwt from "jsonwebtoken"
import { UserModel } from "../models/user.model.js";
const register = async(req,res)=>{
    try{
        console.log(req.body)
        const{username,password}= req.body
        
        if(!username || !password){
            return res.status(400).json({ok:false,msg:'La solicitud fallo'})
        }

        const user =await UserModel.findOneByUsername(username)
        if (user){
            return res.status(409).json({ok:false,msg:'Ya existe es nombre de usuario'})
        }
        
        const newUser = await UserModel.create({username,password})

        const token = jwt.sign({
            idUser : newUser.idUser,username : newUser.username,role:newUser.role
        },
        "PalabraToken",
        {
            expiresIn:"1h"
        }
    )
        return res.status(201).json({ok:true,msg:token})

    }catch(error){
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg:'Error server'
        })
    }
}
const login = async(req,res)=>{
    try{
        const{username,password} = req.body

        if(!username || !password){
            return res
            .status(400)
            .json({ok:false,msg:'Faltan campos por rellenar'})
        }

        const user = await UserModel.findOneByUsername(username)

        
        if(!user){
            return res
            .status(404)
            .json({ok:false,msg:'No existe el usuario'});
        }
        if(password!=user.password){
            return res
            .status(401)
            .json({ok:false,msg:'La contraseña es incorrecta'})
        }
        if(!user){
            return res
            .status(401)
            .json({ok:false,msg:'La contraseña es incorrecta'})
        }
        console.log(user)
        console.log("ID:",user.iduser,"USER:",user.username,"ROL:",user.role)
        const token = jwt.sign({
            iduser : user.iduser, username : user.username, role : user.role
            
        },
        "PalabraToken",
        {
            expiresIn:"1h"
        }
    )
    return res.status(209).json({ok:true,msg:token})
    }catch(error){
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg:'Error server'
        })
    }
}
const profile = async(req,res)=>{
    try{
        const user = await UserModel.findOneByUsername(req.username)
        return res.json({ok:true, msg:user})
    }catch(error){
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg:'Error al traer usuario'
        })
    }
}
const findAll= async(req,res)=>{
    try{
        const  users= await UserModel.findAll()
        return res.json({ok:true,msg:users})
    }catch(error){
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg:'No se pudo encontrar a todos los usuarios'
        })
    }
}
const updateByUserId = async (req, res) => {
    try {
        console.log("Cuerpo de la solicitud:", req.body);  

        const { username, password, role, idUser } = req.body;
        console.log("IdUser del controller", idUser); 

        const users = await UserModel.update({ username, password, role, idUser });
        console.log("Usuario actualizado:", users);

        return res.json({ ok: true, msg: users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'No se pudo actualizar el usuario'
        });
    }
};
const deleteByUserId = async (req, res) => {
    try {
        const { idUser } = req.body;
        console.log("UserID a borrar",idUser)
        await UserModel.deleteUser(idUser);
        return res.json({
            ok: true,
            msg: 'usuario eliminado exitosamente.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'error al intentar eliminar el usuario.',
        });
    }
};

export const UserController ={
    register,
    login,
    profile,
    findAll,
    updateByUserId,
    deleteByUserId
}