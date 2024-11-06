import { Router } from "express";
import path from "path";

const router = Router()

const __dirname = import.meta.dirname
const publicpath = path.join(__dirname,'../public')

router.get('/login',(req,res)=>{
    console.log(publicpath)
    res.sendFile(publicpath+ "/Login.html")
})

router.get('/register',(req,res)=>{
    res.sendFile(publicpath+ "/Registrarse.html")
})

router.get('/paginaprincipal',(req,res)=>{
    res.sendFile(publicpath+ "/PaginaPrincipal.html")
})

router.get('/registerb',(req,res)=>{
    res.sendFile(publicpath+ "/RegistrarLibro.html")
})

export default router