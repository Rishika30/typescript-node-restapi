import { Schema, model } from 'mongoose';

export interface IUserVerification{
    userId: string;
    uniqueString:string;
}

const userVerificationSchema = new Schema<IUserVerification>({
  userId: {
    type: String,
    required: true,
  },
  uniqueString: {
    type: String,
    required: true,
  },
});

const UserVerificationModel = model<IUserVerification>('UserVerification', userVerificationSchema);
export default UserVerificationModel;
