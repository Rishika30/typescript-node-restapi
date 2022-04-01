import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  email: string;
  password: string;
  role: string;
  active: boolean;
  verified: boolean;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  active: {
    type: Boolean,
  },
  verified: {
    type: Boolean,
  },
});

const UserModel = model<IUser>('User', userSchema);
export default UserModel;

UserModel.find({ email: 'admin@gmail.com' }).then((user) => {
  if (user.length < 1) {
    const pass = 'password123';
    bcrypt.hash(pass, 10).then((hash) => {
      const admin = new UserModel<IUser>({
        email: 'admin@gmail.com',
        password: hash,
        role: 'admin',
        active: true,
        verified: true,
      });
      admin.save();
    });
  }
});
