import dbmodels from '../models/dbmodels.js'
import userService from '../service/userService.js'
import { validationResult } from 'express-validator'

export const createUserController = async (req , res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    try{
        const user = await userService.createUser(req.body);

        const token = await user.generateJWT()
        res.status(201).json({user,token})
    }catch{
        res.status(400).send(error.message)
    }
}