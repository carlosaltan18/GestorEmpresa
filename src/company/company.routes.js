'use strict'

import express  from "express"
import { addCompany, generateExcel, getAllCompanies, getCompaniesAZ, getCompaniesCategory, getCompaniesExperiences, getCompaniesZA, updatedCompany } from "./company.controller.js"
import {validateJwt} from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/addCompany', [validateJwt],addCompany)
api.put('/updateCompany/:id', [validateJwt], updatedCompany)
api.get('/getAllCompanies', [validateJwt], getAllCompanies)
api.get('/getCompaniesExperiences', [validateJwt], getCompaniesExperiences)
api.get('/getCompaniesCategory/:id', [validateJwt], getCompaniesCategory)
api.get('/getCompaniesAZ', [validateJwt], getCompaniesAZ)
api.get('/getCompaniesZA', [validateJwt], getCompaniesZA)

api.get('/generateExcel', [validateJwt],generateExcel )

export default api