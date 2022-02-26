import { Request, Response, NextFunction } from 'express';

export const createPostValidator = (req:Request,res:Response,next:NextFunction)=>{
    req.check("name", "Write a name").notEmpty();
    req.check("name", "Name must be between 2 to 20 characters").isLength({
        min: 2,
        max: 20
    });
    req.check("Address", "Write a Address").notEmpty();
    req.check("Address", "Address must be between 4 to 2000 characters").isLength({
        min: 4,
        max: 2000
    });

    //check for errors
    const errors = req.validationErrors();
    //if error show the first one as they happen
    if(errors){
        const firstError = errors.map((error:any)=> error.msg)[0];
        return res.status(400).json({error: firstError});
    }
    next();
};