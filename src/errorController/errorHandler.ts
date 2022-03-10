import {AppError} from "./appError";
import {Request,Response, NextFunction } from "express";

export const errorHandler= (err:AppError, req:Request, res:Response, next:NextFunction)=>{
    const statusCode = err.statusCode||500;
    res.status(statusCode).json({
        message: err.message,
        stack:err.stack
    });
}