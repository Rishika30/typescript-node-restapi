import { Schema, model} from "mongoose";


export interface IUserInfo{
    id:string;
    firstName:string;
    lastName:string;
}

const userInfoSchema = new Schema<IUserInfo>({
    id:{
        type:String,
        required:true
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

const userInfoModel = model<IUserInfo>('UserInfo', userInfoSchema);

export default userInfoModel;