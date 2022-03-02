import { Schema, model,Types } from "mongoose";


export interface iUserInfo{
    postedBy:Types.ObjectId;
    firstName:string;
    lastName:string;
}

const userInfoSchema = new Schema<iUserInfo>({
    postedBy:{
        type:"ObjectId",
        ref:"User"
    },
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
        required:true
    }
})

const userInfoModel = model<iUserInfo>('UserInfo', userInfoSchema);

export default userInfoModel;