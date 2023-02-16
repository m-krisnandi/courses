import mongoose from 'mongoose';
import { app } from './app.js';
import { config } from './config/index.js';


const start = async () => {
  if(!config.jwtKey) {
      throw new Error('JWT_KEY must be defined');
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.urlDb);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }

  app.listen(config.port, () => {
    console.log('Listening on port 5000!');
  });
};

start();
