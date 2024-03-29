import { Request, Response, NextFunction } from 'express';

export const isAuthenticatedValidator = (req:Request, res:Response, next:NextFunction) => {
  req.check('email', 'Email is required').exists();
  req.check('email', 'Enter a valid email').isEmail();

  req.check('password', 'Password is required').exists();
  req.check('password', 'Password should be greater than 4 characters').isLength({
    min: 4,
  });

  // check for errors
  const errors = req.validationErrors();

  // if error show the first one as they happen
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    res.status(400).json({ error: firstError });
  }
  next();
};

export const createPostValidator = (req:Request, res:Response, next:NextFunction) => {
  req.check('firstName', 'Write a name').notEmpty();
  req.check('firstName', 'Name must be between 2 to 20 characters').isLength({
    min: 2,
    max: 20,
  });
  req.check('lastName', 'Write a last name').notEmpty();
  req.check('lastName', 'last name must be between 4 to 20 characters').isLength({
    min: 4,
    max: 20,
  });

  // check for errors
  const errors = req.validationErrors();

  // if error show the first one as they happen
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    res.status(400).json({ error: firstError });
  }
  next();
};
