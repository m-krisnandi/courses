import express from 'express';
import { body } from 'express-validator';
import { Category } from '../models/course-category';
import { validateRequest } from '../middlewares/validate-request';
import { NotFoundError } from '../errors/not-found-error';
import { BadRequestError } from '../errors/bad-request-error';
import { requireAuth } from '../middlewares/require-auth';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

// Get all course categories
router.get(
  '/api/v1/course-categories',
  currentUser,
  requireAuth,
  async (req, res) => {
    const courseCategories = await Category.find();
    res.status(200).send({ courseCategories });
  }
);

// Create a course category
router.post(
  '/api/v1/course-categories',
  currentUser,
  requireAuth,
  [body('name').trim().notEmpty().withMessage('Name must be filled out')],
  validateRequest,
  async (req, res) => {
    const { name } = req.body;

    // Check if the course category already exists
    const check = await Category.findOne({ name });

    if (check) {
      throw new BadRequestError(`Course category with name: ${name} already exists`);
    }

    const courseCategory = await Category({ name });
    await courseCategory.save();
    
    res.status(201).send(courseCategory);
  }
);

// Get a course category by id
router.get(
  '/api/v1/course-categories/:id',
  currentUser,
  requireAuth,
  validateRequest,
  async (req, res) => {
    const { id } = req.params;
    const courseCategory = await Category.findById({ _id: id });
    if (!courseCategory) {
      throw new NotFoundError();
    }
    res.status(200).send(courseCategory);
  }
);

// Update a course category by id
router.put(
  '/api/v1/course-categories/:id',
  currentUser,
  requireAuth,
  [body('name').trim().notEmpty().withMessage('Name must be filled out')],
  validateRequest,
  async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    // Check if the course category already exists and id is not the same
    const check = await Category.findOne({ name, _id: { $ne: id } });

    if (check) {
      throw new BadRequestError(`Course category with name: ${name} already exists`);
    }
    const courseCategory = await Category.findOneAndUpdate(
      { _id: id },
      { name },
      { new: true }
    );

    if (!courseCategory) {
      throw new BadRequestError(`Course category with id: ${id} not found`);
    }

    res.status(200).send({ courseCategory });
  }
);

// Delete a course category by id
router.delete(
  '/api/v1/course-categories/:id',
  currentUser,
  requireAuth,
  validateRequest,
  async (req, res) => {
    const { id } = req.params;
    const courseCategory = await Category.findOneAndRemove({ _id: id });

    if (!courseCategory) {
      throw new BadRequestError(`Course category with id: ${id} not found`);
    }

    res.status(200).send({ message: `Course category with id: ${id} deleted` });
  }
);

export { router as courseCategoryRouter };
