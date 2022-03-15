import {AppError} from "./appError";
import {Request,Response, NextFunction } from "express";

export const errorHandler= (err:Error, req:Request, res:Response, next:NextFunction)=>{
    if(err instanceof AppError){
    const statusCode = err.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack:err.stack
    });
 }else{
        res.status(500).json({
            message:"Something went wrong"
     });
 }
}