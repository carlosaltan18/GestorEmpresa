import express from 'express'
import { deleteUser, login, register, test, updatePassword, updateUser } from './user.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'


const api = express.Router();

api.get('/test', test)
api.post('/register', register)
api.post('/login', login)
api.put('/updateUser',[validateJwt] ,updateUser)
api.delete('/deleteUser', [validateJwt], deleteUser)
api.put('/updatePassword', [validateJwt], updatePassword)
export default api