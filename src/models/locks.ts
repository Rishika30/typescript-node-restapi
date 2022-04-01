import { Schema, model } from 'mongoose';

export interface ILock{
    email:string;
    attempts:number;
    isLocked:boolean;
    unlocksAt:Date;
}

const lockSchema = new Schema<ILock>({
  email: String,
  attempts: Number,
  isLocked: Boolean,
  unlocksAt: Date,
});

const Locks = model<ILock>('Locks', lockSchema);
export default Locks;
