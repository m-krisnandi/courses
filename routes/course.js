import express from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request';
import { Course } from '../models/course';

const router = express.Router();

// Get all courses
router.get('/api/v1/courses', currentUser, requireAuth, async (req, res) => {
  const courses = await Course.find().populate({
    path: 'course_category_id',
    select: 'name',
  });
  res.status(200).send({ courses });
});

// Create a course
router.post(
  '/api/v1/courses', currentUser, requireAuth,
  [body('title').trim().notEmpty().withMessage('Title must be filled out')],
  validateRequest,
  async (req, res) => {
    const { title, course_category_id } = req.body;
    const course = await Course({ title, course_category_id });
    await course.save();
    res.status(201).send({course});
  }
);

// Get a course by id
router.get('/api/v1/courses/:id', currentUser, requireAuth, validateRequest, async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById({ _id: id }).populate({
    path: 'course_category_id',
    select: 'name',
  });

  if (!course) {
    throw new NotFoundError();
  }

  res.status(200).send({course});
});

// Update a course by id
router.put(
    '/api/v1/courses/:id', currentUser, requireAuth,
    [body('title').trim().notEmpty().withMessage('Title must be filled out')],
    validateRequest,
    async (req, res) => {
        const { id } = req.params;
        const { title, course_category_id } = req.body;
        const course = await Course.findOneAndUpdate({ _id: id }, { title, course_category_id });

        if (!course) {
            throw new BadRequestError(`Course with id: ${id} not found`);
        }

        res.status(200).send({ message: `Course with id: ${id} updated` });
    }
)

// Delete a course by id
router.delete('/api/v1/courses/:id', currentUser, requireAuth, validateRequest, async (req, res) => {
    const { id } = req.params;
    const course = await Course.findOneAndRemove({ _id: id });

    if (!course) {
        throw new BadRequestError(`Course with id: ${id} not found`);
    }

    res.status(200).send({ message: `Course with id: ${id} deleted` });
})

export { router as courseRouter };
