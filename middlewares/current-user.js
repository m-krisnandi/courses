import jwt from 'jsonwebtoken';
import { config } from '../config';

export const currentUser = (req, res, next) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      config.jwtKey
    );
    req.currentUser = payload;
  } catch (err) {}
  next();
};