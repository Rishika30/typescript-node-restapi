import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errorController/appError';
import UserModel from '../models/user';
import Token from '../models/token';

export const forgotPassword = async (req:Request, res:Response, next: NextFunction) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      throw new AppError('User does not exist', 404);
    }
    const token = await Token.findOne({ email: user.email });
    if (token) {
      token.deleteOne();
    }
    const passwordToken = crypto.randomBytes(32).toString('hex');
    const salt = crypto.randomBytes(128).toString('base64');
    const hash = crypto.createHmac('sha256', salt);
    const value = hash.update(passwordToken).digest('hex');

    const newToken = await new Token({
      email: user.email,
      token: value,
      createdAt: Date.now(),
    }).save();

    res.json(newToken);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const passwordResetToken = await Token.findOne({ email: req.body.email });
    if (!passwordResetToken) {
      throw new AppError('Invalid user', 404);
    }
    if (req.body.token === passwordResetToken.token) {
      const newPass = await bcrypt.hash(req.body.newPassword, 10);
      await
      UserModel.updateOne({ email: req.body.email }, { password: newPass }, { verified: true });
      res.json('Password reset successfully');
    } else {
      throw new AppError('Invalid token', 401);
    }
  } catch (error) {
    next(error);
  }
};
