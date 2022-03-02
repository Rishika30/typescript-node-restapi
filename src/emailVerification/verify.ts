import nodemailer from "nodemailer";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";
import {Request, Response, NextFunction} from "express";
import userVerificationModel, {iUserVerification} from "../models/userVerification";
import userModel from "../models/user";

export const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.AUTH_EMAIL,
        pass:process.env.AUTH_PASS
    }
});

export const verifyEmail =(req:Request, res:Response)=>{
    const {userId, uniqueString} = req.params;
    userVerificationModel.find({userId}).then((result)=>{
        if(result.length>0){
            const hashedUniqueString = result[0].uniqueString;
            bcrypt.compare(uniqueString, hashedUniqueString).then(result=>{
                if(result){
                    userModel.updateOne({_id:userId}, {verified:true}).then(()=>{
                        userVerificationModel.deleteOne({userId}).then(()=>{
                            res.send("User Verification done successfully");
                        }).catch(err=>{
                            res.send("Error occurred");
                        });
                    }).catch(error=>{
                        res.json({
                            message: "Errpr occurred while updating user record to show verified"
                        });
                    });
                }else{
                    res.send('Invalid verification details sent');
                }
            }).catch(error=>{
                res.send("Error occurred while comparing unique string");
            });
        }
    }).catch(error=>{
        res.send("Error occurred while checking for user verification record");
    });
}