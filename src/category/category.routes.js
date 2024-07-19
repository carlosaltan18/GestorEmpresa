import express from 'express'
import { addCategory, deleteCategory, findCategory, getAllCategories, test, updatedCategory } from './category.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js';


const api = express.Router()

api.get('/test', test)
api.post('/addCategory', [validateJwt], addCategory)
api.put('/updateCategory/:id', [validateJwt], updatedCategory)
api.delete('/deleteCategory/:id', [validateJwt], deleteCategory)
api.get('/getAllCategories', [validateJwt], getAllCategories)
api.get('/findCategory', [validateJwt], findCategory)

export default api