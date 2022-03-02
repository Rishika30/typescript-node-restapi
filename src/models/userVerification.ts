import {Schema, model} from "mongoose";

export interface iUserVerification{
    userId: string;
    uniqueString:string;
}

const userVerificationSchema = new Schema<iUserVerification>({
    userId:{
        type:String,
        required:true
    },
    uniqueString:{
        type:String,
        required:true
    }
});

const userVerificationModel = model<iUserVerification>('UserVerification', userVerificationSchema);
export default userVerificationModel;

