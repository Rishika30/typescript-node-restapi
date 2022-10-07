import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  max: 5,
  windowMs: 10000,
  message: 'You have exceeded 5 login attempts in 10 seconds',
  headers: true,
});

export default limiter;
