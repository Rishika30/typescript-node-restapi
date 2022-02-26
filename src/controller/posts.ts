import {Request, Response, NextFunction} from "express";
import * as bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import {iUser} from "../models/user";
import userModel from "../models/user";
import userInfoModel, { iUserInfo } from "../models/userInfo";

export const signup = (req:Request,res:Response)=>{
    userModel.find({email:req.body.email}).exec()
    .then(user=>{
        if(user.length>=1){
            return res.status(409).json({
                message:'mail already exists'
            });
        }else{
            bcrypt.hash(req.body.password, 10).then(hash =>{
                userModel.create({email:req.body.email, password:hash, role: "basic", active: true})
                .then(()=>{
                    res.send("User Registered");
                }).catch((err)=>{
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
        const pass = req.body.password;
        bcrypt.compare(pass, user.password).then((match)=>{
            if(!match){
                res.sendStatus(400).json({error: "wrong password"});
            }else{
                const accessToken = generateToken(user);
                res.json({accessToken:accessToken, id: user._id});
            }
        });
    }else{
        res.send("Mail not registered");
    }
}

function generateToken(user:iUser){
    return jwt.sign(user, "my_secret_key");
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
            next();
        }
    });
}

export const view= (req:Request, res:Response)=>{
    if(req.user.role=="admin"){
        userInfoModel.find().then((p)=>{
            console.log(p);
        }).catch(error=>{
            console.log(error);
        });
    }
}

export const add= (req:Request, res:Response)=>{
    if(req.user.role=="basic" && req.user.active==true && req.user._id == req.params.id){
    userInfoModel.create(req.body as iUserInfo).then(()=>{
        res.send("User Info created");
    });
}else{
    res.send("Cannot add info");
}
}

export const update= (req:Request, res:Response)=>{
    if(req.user.role=="basic" && req.user.active==true && req.user._id == req.params.id){
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
    if(req.user.role=="admin"){
        userModel.findOne({ _id: req.params.id }, function (err:any,user:iUser) {
            user.active=false;
        });  
    }
}