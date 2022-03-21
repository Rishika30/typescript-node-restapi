import {Request, Response, NextFunction, query} from "express";
import * as bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from "uuid";
import dotenv from 'dotenv';
dotenv.config();
import userModel from "../models/user";
import userInfoModel, {iUserInfo } from "../models/userInfo";
import userVerificationModel from "../models/userVerification";
import {transporter} from "../emailVerification/verify";
import {AppError} from "../errorController/appError";
import {createLock,invalidAttempt,resetLock} from "../loginLimit/loginAttempts";
import {checkLocked, lockTime} from "../loginLimit/loginAttempts";
let refreshTokens:string[]= [];

export const signup = async(req:Request,res:Response, next:NextFunction)=>{
    await userModel.find({email:req.body.email}).exec()
    .then((user)=>{
        if(user.length>=1){
            throw new AppError('Email already exists',409);
        }
        const pass:string= req.body.password;
        bcrypt.hash(pass, 10).then(hash =>{
                userModel.create({email:req.body.email, password:hash, role: "basic", active: true,verified:false})
                .then((result)=>{
                    sendVerificationEmail(result,res);
                    res.json({
                        message:"User Registered and Verification mail sent",
                        data: result
                    });
                })
                .catch((err)=>{
                    if(err){
                        res.json({error:err});
                    }
                });
            }).catch((err)=>{
                res.json({error:err});
            });
    }).catch(e=>{
        next(e);
    });
}

export const login= async(req:Request, res:Response, next:NextFunction)=>{
    try{
    const user= await userModel.findOne({email: req.body.email});
    if(!user){
        throw new AppError("Mail not registered", 404);
    }
    createLock(req.body.email);
    if(checkLocked(req.body.email)){
        if(lockTime(req.body.email)){
            throw new AppError("Account locked due to invalid attempts.Try again after 60 seconds",401);
        }
        resetLock(req.body.email);
    }
        const pass = req.body.password;
        const match= await bcrypt.compare(pass, user.password);
        if(!match){
            invalidAttempt(req.body.email);
            throw new AppError("Wrong password",403);
        }
        if(user.role=="admin" || user && user.active==true){
        if(user.verified ==false){
            throw new AppError("Email hasn't been verified", 401);
        }

        const userr= {_id:user._id,active:user.active,role:user.role,verified:user.verified};
        const accessToken :string = generateToken(userr);
        const refreshToken:string = jwt.sign(userr, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);
       
        return res.json({accessToken, id: userr._id, refreshToken});
    }
    throw new AppError("User is not active",403);
    }catch(error){
         next(error);
    }
}

function generateToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , {expiresIn: "1d"});
}

export function ensureToken(req:Request, res:Response, next:NextFunction){
    const authHeader= req.headers['authorization'];
    const token= authHeader && authHeader.split(' ')[1];
    if(token==null){
        return res.sendStatus(401).json({error: "Not Authenticated"});
    }
    try{
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err,data)=>{
        if(err){
            throw new AppError("Token not verified",403);
        }
        req.user= data;
        //console.log(req.user);
        next();
    });
}catch(e){
    next(e);
}
}

export const token = (req:Request, res:Response, next:NextFunction)=>{
    const refreshToken = req.body.token;
    if(refreshToken==null){
        return res.sendStatus(401);
    }
    if(!refreshTokens.includes(refreshToken)){
        return res.sendStatus(403);
    }
    try{
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err:any,user)=>{
        if(err){
            throw new AppError("Token not verified",403);
            //return res.sendStatus(403);
        }
        //console.log(user);
        const accessToken= generateToken({_id:user._id,role:user.role,active:user.active,verified:user.verified});
        res.json({accessToken});
    });
}catch(e){
    next(e);
}
}

const sendVerificationEmail = ({_id, email},res)=>{
    const currUrl = "http://localhost:3000/";
    const uniqueString = uuidv4() +_id;
    
    const mailOptions ={
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Email Verification",
        html: `<p>Verify your email address to complete the signup process.
        <p> Press <a href= ${currUrl + "verify/" + _id + "/" + uniqueString}> here </a> to proceed </p>`
   };

       const newVerification = new userVerificationModel({
           userId : _id,
           uniqueString: uniqueString
       });

          newVerification.save().then(()=>{
               transporter.sendMail(mailOptions, function(err,response){
                   if(err){
                       console.log(err);
                   }else{
                       console.log("Verification mail sent");
                   }
               });
           }).catch(e=>{
               console.log(e);
           });
}

//Admin can view all user's info
export const view= (req:Request, res:Response, next:NextFunction)=>{
    if(req.user.role=="admin"){
        userInfoModel.find().then((p)=>{
            res.json({
                data:p
            });
        }).catch(error=>{
            console.log(error);
        });
    }
}

//Users can view their info
export const viewPost= async(req:Request, res:Response, next:NextFunction)=>{
    try{
     if(req.user.role=="basic" && req.user.active==true && req.user._id==req.params.id){
         const id= req.params.id;
         const info = await userInfoModel.find({id});
        return res.json({info});
    }
    throw new AppError("Cannot find info",401);
}catch(e){
    next(e);
}
}

export const add= async(req:Request, res:Response, next:NextFunction)=>{
    try{
    if(req.user.role=="basic" && req.user.active==true){
        const id= req.params.id;
        if(id!==req.user._id){
            throw new AppError("Cannot find the user",404);
        }
        const postExist= await userInfoModel.find({id});
        if(postExist.length>0){
            throw new AppError("User has already added info", 409);
        }
        const newUserInfo = new userInfoModel({
            id: req.user._id,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
        newUserInfo.save();
        return res.send("userInfo created");
}
throw new AppError("Cannot add info",401);
}catch(e){
    next(e);
}
}

export const update= async(req:Request, res:Response,next:NextFunction)=>{
    try{
    if(req.user.role=="basic" && req.user.active==true && req.user._id == req.params.id){
        const updates= req.body;
         if(updates.firstName){
             if((updates.firstName).length <2 || (updates.firstName).length>20){
                 return res.json("Name must be between 2 to 20 characters");
             }
         }
         if(updates.lastName){
             if((updates.lastName).length <4 || (updates.lastName).length>20){
                 return res.json("Last name must be between 4 to 20 characters");
             } 
         }
        
        const result= await userInfoModel.findOneAndUpdate(req.params, updates,{runValidators:true, new:true});
        
        return res.json({
            message:"User info updated",
            data: result
        });
}
throw new AppError("Cannot update info", 401);
    }catch(e){
        next(e);
    }
}

export const deactivate= async(req:Request, res:Response, next:NextFunction)=>{
    try{
    if(req.user.role=="admin"){
        const update= {active:false};
        const user= await userModel.findOneAndUpdate({ _id: req.params.id }, update, {new:true});
         if(!user){
             throw new AppError("Cannot find user",409);
         }
         return res.json({user});
    }
    throw new AppError("Cannot deactivate user",401);
  }catch(e){
      next(e);
  }
}

export const activate= async(req:Request, res:Response, next:NextFunction)=>{
    try{
    if(req.user.role=="admin"){
        const user= await userModel.findOne({ _id: req.params.id });
         if(!user){
             throw new AppError("Cannot find user",409);
         }
        user.active=true;
        user.save();
        return res.json({user});
    }
    throw new AppError("Cannot activate user",401);
 }
 catch(e){
     next(e);
 }
}