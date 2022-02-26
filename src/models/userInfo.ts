import { Schema, model,Types } from "mongoose";


export interface iUserInfo{
    name:string;
    address:string;
}

const userInfoSchema = new Schema<iUserInfo>({
    name:{
        type:String,
        required: true
    },
    address:{
        type:String,
        required:true
    }
})

const userInfoModel = model<iUserInfo>('UserInfo', userInfoSchema);

export default userInfoModel;