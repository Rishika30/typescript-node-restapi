import { Schema, model,Types } from "mongoose";


export interface iUserInfo{
    id:string;
    //postedBy:Types.ObjectId;
    firstName:string;
    lastName:string;
}

const userInfoSchema = new Schema<iUserInfo>({
    id:{
        type:String,
        required:true
    },
    // postedBy:{
    //     type:"ObjectId",
    //     ref:"User"
    // },
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