import express from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';

const router = express.Router();

// Get all user
router.get('/api/v1/users', async (req, res) => {
  const users = await User.find();
  res.status(200).send({ users });
});

// Create a user
router.post(
  '/api/v1/users',
  [body('name').trim().notEmpty().withMessage('Name must be filled out')],
  [body('email').trim().notEmpty().withMessage('Email must be valid')],
  [
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password must be filled out'),
  ],
  validateRequest,
  async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }
    const user = await User({ name, email, password });
    await user.save();
    res.status(201).send({ user });
  }
);

// Get a user by id
router.get('/api/v1/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });

  if (!user) {
    throw new NotFoundError();
  }

  res.status(200).send({ user });
});

// Update a user by id
router.put(
  '/api/v1/users/:id',
  [body('name').trim().notEmpty().withMessage('Name must be filled out')],
  [body('email').trim().notEmpty().withMessage('Email must be valid')],
  [
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password must be filled out'),
  ],
  validateRequest,
  async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: id },
      { name, email, password },
      { new: true }
    );
    if (!user) {
      throw new BadRequestError(`User with id: ${id} not found`);
    }

    res.status(200).send({ user });
  }
);

// Delete a user by id
router.delete('/api/v1/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndRemove({ _id: id });

  if (!user) {
    throw new BadRequestError(`User with id: ${id} not found`);
  }

  res.status(200).send({ message: `User with id: ${id} deleted` });
});

export { router as userRouter };
