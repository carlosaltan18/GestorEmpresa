'use strict'

import Category from './category.model.js'

export const test = (req, res)=>{
    console.log('test is running Categoty')
    return res.send({message: 'Test is running Category'})
}

export const addCategory = async (req, res) =>{
    try {
        let data = req.body
        console.log(data)
        let category = new Category(data)
        await category.save()
        return res.send({message: `Registered successfully,${category.nameCategory} was register`})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Faild add category ', error: error})
        
    }
}

export const updatedCategory = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let updatedCategory = await Category.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
            )
        if(!updatedCategory) return res.status(404).send({message: ' Category not updated and not found'})
        return res.send({message: 'Category has been updated'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Faild update category'})
    }
}


export const deleteCategory = async (req, res) =>{
    try {
        let{id} = req.params
        let deletedCategory =  await Category.findOneAndDelete({_id: id})
        if(!deletedCategory) return res.status(404).send({message: 'Category not found and not deleted'})
        return res.send({message: `Category ${deletedCategory.nameCategory} deleted successfully`})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Faild delete Category'})
    }

}

export const getAllCategories = async (req, res) => {
    try {
        let categories = await Category.find()
    return res.send({categories})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'categories not found'})
    }
}

export const findCategory = async (req, res) => {
    try {
        let { name } = req.body
        let category = await Category.find({nameCategory: name})
    return res.send({category})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: ' Category not found'})
    }
}