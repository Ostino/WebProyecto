import 'dotenv/config'
import express from 'express';
import userRouter from './routes/user.route.js'
import libroRouter from './routes/libro.route.js'
import publicRouter from './routes/public.route.js'
import carritoRouter from './routes/carrito.route.js'
import path from 'path'

//correr servidor npm run dev
 const app = express();
 // http://localhost:3000/api/v1/users/login
 // http://localhost:3000/login
 app.use(express.json())

 app.use(express.urlencoded({extended:true}))

 app.use(express.static(path.join(path.resolve(), 'public')));

 app.use(express.static(path.join(path.resolve(), '/JS')));


 app.use('/',publicRouter)
 app.use('/api/v1/users',userRouter)
 app.use('/api/v1/libros',libroRouter)
 app.use('/api/v1/carrito',carritoRouter)
 
 const PORT = process.env.PORT || 3000

 app.listen(PORT ,()=>console.log('Servidor corriendo en '+PORT))
