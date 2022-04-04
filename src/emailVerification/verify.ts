import nodemailer from 'nodemailer';
import { NextFunction, Request, Response } from 'express';
import userVerificationModel from '../models/userVerification';
import userModel from '../models/user';
import { AppError } from '../errorController/appError';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

export const verifyEmail = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { userId } = req.params;
    const result = await userVerificationModel.find({ userId });
    if (result) {
      await userModel.updateOne({ _id: userId }, { verified: true });
      await userVerificationModel.deleteOne({ userId });
      res.send('User Verification done successfully');
      return;
    }
    throw new AppError('Invalid verification details sent', 422);
  } catch (e) {
    next(e);
  }
};
