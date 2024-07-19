'use strict'

import Company from "./company.model.js"
import ExcelJS from 'exceljs'
import {checkUpdate, checkUpdateCompany} from '../utils/validator.js'

export const addCompany = async (req, res) => {
    try {
        let data = req.body
        let company = new Company(data)
        await company.save()
        return res.send({ message: `Company: ${company.nameCompany} created succesfully` })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Company has not been saved' })
    }
}

export const updatedCompany = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = await checkUpdateCompany(data, id)
        if(!update) return res.status(400).send({message: 'Data not updateable'})
        let updatedCompany = await Company.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedCompany) return res.status(404).send({message: 'Company not updated because and nor found'})
        return res.send({message: `Company ${updatedCompany.nameCompany} has been updated`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Company has not been updated'})
    }
}

export const getAllCompanies = async (req, res) => {
    try {
        let companies = await Company.find().populate('category', ['nameCategory'])
        return res.send({companies})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'companies not found'})
    }
}

export const getCompaniesExperiences = async (req, res) => {
    try {
        let data = req.body
        let companyYears = await Company.find({experienceYears: data.experienceYears}).populate('category', ['nameCategory'])
        return res.send({companyYears})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Companies not found'})
    }
}

export const getCompaniesCategory = async (req, res) => {
    try {
        let { id } = req.params
        let company = await Company.find({category: id}).populate('category', ['nameCategory'])
        if (!company) return res.status(404).send({message: 'Companies of category not exist'});
        return res.send({company});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Companies with this category have not been found', error: error});
    }
}

export const getCompaniesAZ = async (req, res) => {
    try {
        let companyAZ = await Company.find().sort({nameCompany: +1}).populate('category', ['nameCategory'])
        return res.send({companyAZ});
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Not found companies A-Z' });
    }
}

export const getCompaniesZA = async (req, res) => {
    try {
        let company = await Company.find().sort({nameCompany: -1}).populate('category', ['nameCategory'])
        return res.send({company})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: ' Not found companies Z-A'})
    }
}

export const generateExcel = async (req, res) => {
    try {
        let companies = await Company.find().populate('category', ['nameCategory', 'description']);

        // libro excel
        let libro = new ExcelJS.Workbook();
        let worksheet = libro.addWorksheet('Companies');

        //estilo 
        let headerStyle = {
            font: { bold: true},
            alignment: { horizontal: 'center' },
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        };

        let cellStyle = {
            font: { color: { argb: '000000' } },
            border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B3B8E6' } } 
        };
        // Agregar encabezados de columna
        worksheet.columns = [
            { header: 'Name', key: 'nameCompany', width: 20, style: headerStyle },
            { header: 'Category', key: 'nameCategory', width: 20, style: headerStyle},
            { header: 'Impact', key: 'levelImpact', width: 40, style: headerStyle },
            { header: 'Description', key: 'description', width: 40, style: headerStyle }
        ];

        // Agregar datos de empresas al documento Excel
        companies.forEach(company => {
            worksheet.addRow({
                nameCompany: company.nameCompany,
                nameCategory: company.category.nameCategory, 
                levelImpact: company.levelImpact,
                description: company.category.description 
            }).eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Alinear texto al centro vertical y horizontalmente
                cell.style = cellStyle;
            });
        });
        // Escribir el documento Excel en un archivo
        let filePath = 'companies.xlsx';
        await libro.xlsx.writeFile(filePath);

        // Adjuntar el archivo Excel a la respuesta HTTP
        res.attachment(filePath);
        res.send();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error fetching companies and generating Excel', error: error });
    }
}