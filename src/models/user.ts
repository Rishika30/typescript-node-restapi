import { Schema, model } from "mongoose";

export interface iUser{
    email: string;
    password: string;
    role:string;
    active:boolean;
}

const userSchema = new Schema<iUser>({
    email:{
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        required: true
    }
});

const userModel = model<iUser>('User', userSchema);
export default userModel;

const admin= new userModel<iUser>({
    email: "admin@gmail.com",
    password: "password123",
    role: "admin",
    active: true
});

admin.save();