import express from 'express';

import { body } from 'express-validator';
import { Admin } from '../models/admin';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { config } from '../config';

const router = express.Router();

router.post(
  '/api/v1/admin/signup',
  [
    body('name').trim().notEmpty().withMessage('Name must be filled out'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req, res) => {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      throw new BadRequestError('Email in use');
    }

    const admin = Admin.build({ name, email, password });
    await admin.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      config.jwtKey
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(admin);
  }
);

export { router as signupRouter };
