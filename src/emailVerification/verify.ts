import nodemailer from 'nodemailer';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import EventEmitter from 'events';
import UserModel from '../models/user';
import { AppError } from '../errorController/appError';
import UserVerificationModel from '../models/userVerification';

dotenv.config();
const eventEmitter = new EventEmitter();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

export const sendVerificationEmail = ({ _id, email }) => {
  const currUrl = 'http://localhost:3000/';
  const uniqueString = uuidv4() + _id;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: 'Email Verification',
    html: `<p>Verify your email address to complete the signup process.
          <p> Press <a id="link" href= ${`${currUrl}verify/${_id}/${uniqueString}`}> here </a> to proceed </p>`,
  };

  const newVerification = new UserVerificationModel({
    userId: _id,
    uniqueString,
  });

  newVerification.save().then(() => {
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Verification mail sent');
      }
    });
  }).catch((e) => {
    console.log(e);
  });
};

export const verifyEmail = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { userId } = req.params;
    const result = await UserVerificationModel.find({ userId });
    if (result) {
      const user = await UserModel.findOne({ _id: userId });
      await UserModel.updateOne({ _id: userId }, { verified: true });
      await UserVerificationModel.deleteOne({ userId });
      res.send('User Verification done successfully');
      eventEmitter.on('start', () => {
        transporter.sendMail({
          from: process.env.AUTH_EMAIL,
          to: user.email,
          subject: 'Welcome Mail',
          html: '<p> Successfully registered and verified </p>',
        });
      });
      eventEmitter.emit('User Verification done successfully');
      return;
    }
    throw new AppError('Invalid verification details sent', 422);
  } catch (e) {
    next(e);
  }
};
