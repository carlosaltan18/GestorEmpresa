'use strict'

import express from 'express'
import morgan from 'morgan'
import { config } from "dotenv"

//imports routes 
import userRoutes from '../src/user/user.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import companyRoutes from '../src/company/company.routes.js'

//Configuraciones
const app = express()
config()
const port = process.env.PORT || 3056


//Configuración del servidor
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(morgan('dev')) //Logs de solicitudes al servidor HTTP

//Routes
app.use('/user',userRoutes)
app.use('/category', categoryRoutes)
app.use('/company', companyRoutes)

export const initServer = ()=>{
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}
