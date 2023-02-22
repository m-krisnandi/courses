import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { config } from '../config';

import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { Admin } from '../models/admin';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/v1/admin/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      throw new BadRequestError('Email in use');
    }

    const passwordsMatch = await Password.compare(
      existingAdmin.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid password');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingAdmin.id,
        email: existingAdmin.email,
      },
      config.jwtKey
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    delete existingAdmin._doc.password;

    res.status(200).send(existingAdmin);
  }
);

export { router as signinRouter };
