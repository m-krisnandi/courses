import dotenv from 'dotenv';
dotenv.config();

export const config = {
  jwtKey: process.env.JWT_KEY,
  urlDb: process.env.MONGO_URL,
  port: process.env.APP_PORT,
};