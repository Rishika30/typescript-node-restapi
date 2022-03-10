import nodemailer from "nodemailer";
import {Request, Response, NextFunction} from "express";
import userVerificationModel, {iUserVerification} from "../models/userVerification";
import userModel from "../models/user";

export const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
});

export const verifyEmail = async(req:Request, res:Response, next:NextFunction)=>{
    const {userId} = req.params;
    const result= await userVerificationModel.find({userId});
    if(result){
                await userModel.updateOne({_id:userId}, {verified:true}).then(()=>{
                userVerificationModel.deleteOne({userId}).then(()=>{
                    res.send("User Verification done successfully");
                }).catch(err=>{
                    res.send(`Error occurred: ${err}`);
                });
            }).catch(err=>{
                res.json({
                    message: `Error occurred while updating user record to show verified :${err}`
                    });
            });
    }else{
           res.send('Invalid verification details sent');
        }
}