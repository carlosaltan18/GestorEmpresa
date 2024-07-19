'use strict' 

import User from './user.model.js'
import { generarjwt } from '../utils/jwt.js'
import { encrypt, checkPassword, checkUpdate, checkUpdatePassword} from '../utils/validator.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const createUserDefault = async(req, res)=>{
    try {
        let  userExist = await User.findOne({email: 'carlos@example.com'})
        if (!userExist) {
        let passwordD = await encrypt('12345678')
        let newUser = new User({
            name: 'Carlos',
            surname: 'Cortez',
            username: 'caralt',
            password: passwordD,
            email: 'carlos@example.com',
            phone: '12352602'
          });
        let user = new User(newUser)
        await user.save()
        console.log('User register correctly');
        } else {
        console.log('Alredy exist User.');
        }

    } catch (error) {
        console.error(error)
        console.log('fail add user')
    }
}


export const register = async(req, res) =>{
    try {
        let data = req.body
        console.log(data)
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({message: `Registered successfully, can be logged with username ${user.username}`})
    } catch (error) {
        console.error(error)
        if(error.keyValue.username) return res.status(400).send({message: `username ${error.keyValue.username} is alredy taken ` })
        return res.status(500).send({message: 'Error registering user', error: error})
    }

}


export const login = async (req, res) => {
    try {
        let data = req.body
        let loginUs = await User.findOne({
            $or:[ 
                {
                    username: data.username
                },
                {
                    email: data.email
                }
            ]
        })
        if(!loginUs) return res.status(404).send({message: 'error validate username or email'})

        if(loginUs){
            if( await checkPassword(data.password, loginUs.password)){
                let loggedUser = {
                    uid: loginUs._id,
                    username: loginUs.username, 
                    name:  loginUs.name
                }
                let token = await generarjwt(loggedUser)
                return res.send({message: `Welcome ${loggedUser.name}`, loggedUser, token})
            }
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error login user', error: error})
    }

}

export const updateUser = async(req, res)=>{
    try {
        let data = req.body
        data._id = req.user._id

        let update =  await checkUpdate(data, data._id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be update'})
        let updateUser = await User.findOneAndUpdate(
            { _id: data._id },
            data,
            {new: true} 
        )
        if (!updateUser) return res.status(401).send({ message: 'user not found' })
        return res.send({ message: 'user update', updateUser })

        
    } catch (error) {
        console.error(error)
        if(error.keyValue.username) return res.status(400).send({message: `username ${error.keyValue.username} is alredy taken ` })
        return res.status(500).send({ message: 'Error updating' })
    }

}

export const updatePassword = async(req, res)=>{
    try {
        let data = req.body
        data._id = req.user._id

        if (data.password) {
            let user = await User.findById(data._id);
            if (!user) return res.status(401).send({ message: 'User not found' })
    
            let isPasswordValid = await checkPassword(data.password, user.password)
            if (!isPasswordValid) {
                return res.status(400).send({ message: 'The password is not correct' })
            }else{
                data.password = await encrypt(data.newPassword)
            }
        }
        let update =  await checkUpdatePassword(data, data._id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be Update password'})
        let updateUser = await User.findOneAndUpdate(
            { _id: data._id },
            data,
            {new: true} 
        )
        if (!updateUser) return res.status(401).send({ message: 'user not found' })
        return res.send({ message: 'Update password', updateUser })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error Update password' })
    }

}

export const deleteUser = async (req, res)=>{
    try {
        let data = req.body
        data._id = req.user._id
        let deletedAccount =  await User.findOneAndDelete({_id: data._id})
        if(!deletedAccount) return res.status(404).send({message: 'Account not found and not deleted'})
        return res.send({message: `Account ${deletedAccount.username} deleted successfully`})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting account'})
    }

}