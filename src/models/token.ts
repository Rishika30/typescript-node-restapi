import { Schema, model } from 'mongoose';

export interface IToken{
    email: string;
    token: string;
    createdAt: Date;
}

const tokenSchema = new Schema<IToken>({
  email: String,
  token: String,
  createdAt: Date,
});

const Token = model<IToken>('Token', tokenSchema);
export default Token;
