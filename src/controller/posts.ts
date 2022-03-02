import {Request, Response, NextFunction} from "express";
import * as bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from "uuid";
import dotenv from 'dotenv';
dotenv.config();
import {iUser} from "../models/user";
import userModel from "../models/user";
import userInfoModel, {iUserInfo } from "../models/userInfo";
import userVerificationModel from "../models/userVerification";
import {transporter} from "../emailVerification/verify";

let refreshTokens:string[]= [];

export const signup = (req:Request,res:Response)=>{
    userModel.find({email:req.body.email}).exec()
    .then(user=>{
        if(user.length>=1){
            return res.status(409).json({
                message:'mail already exists'
            });
        }else{
            bcrypt.hash(req.body.password, 10).then(hash =>{
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
                        res.sendStatus(400).json({error:err});
                    }
                });
            });
        }
    });
}

export const login= async(req:Request, res:Response)=>{
    const user= await userModel.findOne({email: req.body.email});
    if(user && user.active==true){
        if(user.verified ==false){
            res.json({
                message:"Email hasn't been verified"
            });
        }else{
            const pass = req.body.password;
            bcrypt.compare(pass, user.password).then((match)=>{
            if(!match){
                return res.sendStatus(400).json({error: "wrong password"});
            }else{
                const accessToken :string = generateToken(user);
                const refreshToken:string = jwt.sign({user}, "refresh_token_secret");
                refreshTokens.push(refreshToken);
                res.json({accessToken, id: user._id, refreshToken});
            }
        });
        } 
    }
    else{
        return res.send("Mail not registered");
    }
}

function generateToken(user:iUser){
    return jwt.sign({user}, "my_secret_key", {expiresIn: "45s"});
}

export function ensureToken(req:Request, res:Response, next:NextFunction){
    const authHeader= req.headers['authorization'];
    const token= authHeader && authHeader.split(' ')[1];
    if(token==null){
        return res.sendStatus(401).json({error: "Not Authenticated"});
    }
    jwt.verify(token, "my_secret_key", (err,data)=>{
        if(err){
            return res.sendStatus(403);
        }else{
            req.user= data;
           // console.log(req.user);
            next();
        }
    });
}

export const token = (req:Request, res:Response)=>{
    const refreshToken = req.body.token;
    if(refreshToken==null){
        return res.sendStatus(401);
    }
    if(!refreshTokens.includes(refreshToken)){
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken, "refresh_token_secret", (err:any,user:any)=>{
        if(err){
            return res.sendStatus(403);
        }
        //console.log(user);
        const accessToken= generateToken(user);
        res.json({accessToken});
    });
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

   bcrypt.hash(uniqueString, 10)
   .then((hashedUniqueString)=>{
       const newVerification = new userVerificationModel({
           userId : _id,
           uniqueString: hashedUniqueString
       });

          newVerification.save().then(()=>{
               transporter.sendMail(mailOptions).then(()=>{
               res.json({
                   message:"verification mail sent"
               });
           }).catch((error)=>{
               res.sendStatus(403).json({
                   message:"Failed email verification"
               });
           })
       });
   }).catch(error =>{
       res.json("Error occurred while hashing email data");
   });
}

export const view= (req:Request, res:Response)=>{
    if(req.user.user.role=="admin"){
        userInfoModel.find().then((p)=>{
            console.log(p);
        }).catch(error=>{
            console.log(error);
        });
    }
}

export const getPost= (req:Request, res:Response)=>{
    if(req.user.user.role=="basic" && req.user.user.active=="true" && req.params.id==req.user.user._id){
        userInfoModel.find().then((p)=>{
            res.json(p);
        });
    }
}

export const add= (req:Request, res:Response)=>{
    if(req.user.user.role=="basic" && req.user.user.active==true){
    userInfoModel.create(req.body as iUserInfo).then(()=>{
        res.send("User Info created");
    });
}else{
    res.send("Cannot add info");
}
}

export const update= (req:Request, res:Response)=>{
    if(req.user.user.role=="basic" && req.user.user.active==true && req.user.user._id == req.params.id){
        //userInfoModel.name=req.body.name;
        let user_data = new userInfoModel({_id:req.params.id,name: req.body.name, address:req.body.address});
        user_data.save().then(()=>{
            res.json({user_data});
        }).catch(error=>{
            res.json(error);
        });
}else{
    res.send("Cannot update info");
}
}

export const deactivate= (req:Request, res:Response)=>{
    if(req.user.user.role=="admin"){
        userModel.findOne({ _id: req.params.id }, function (err:any,user:iUser) {
            user.active=false;
        });
    }
}