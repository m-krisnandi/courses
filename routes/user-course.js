import express from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request';
import { userCourse } from '../models/user_course';

const router = express.Router();

// Get all user courses
router.get(
  '/api/v1/user-courses',
  currentUser,
  requireAuth,
  async (req, res) => {
    const userCourses = await userCourse
      .find()
      .populate({
        path: 'users_id',
        select: 'name email',
      })
      .populate({
        path: 'course_id',
        select: 'title',
      });
    res.status(200).send({ userCourses });
  }
);

// Create a user course
router.post(
  '/api/v1/user-courses',
  currentUser,
  requireAuth,
  [
    body('users_id')
      .trim()
      .notEmpty()
      .withMessage('User id must be filled out'),
  ],
  [
    body('course_id')
      .trim()
      .notEmpty()
      .withMessage('Course id must be filled out'),
  ],
  validateRequest,
  async (req, res) => {
    const { users_id, course_id } = req.body;
    const userCourses = await userCourse({ users_id, course_id });
    await userCourses.save();
    res.status(201).send({ userCourses });
  }
);

// Get a user course by id
router.get(
  '/api/v1/user-courses/:id',
  currentUser,
  requireAuth,
  validateRequest,
  async (req, res) => {
    const { id } = req.params;
    const userCourses = await userCourse
      .findById({ _id: id })
      .populate({
        path: 'users_id',
        select: 'name email',
      })
      .populate({
        path: 'course_id',
        select: 'title',
      });

    if (!userCourses) {
      throw new NotFoundError();
    }

    res.status(200).send(userCourses);
  }
);

// Update a user course by id
router.put(
  '/api/v1/user-courses/:id',
  currentUser,
  requireAuth,
  [
    body('users_id')
      .trim()
      .notEmpty()
      .withMessage('User id must be filled out'),
  ],
  [
    body('course_id')
      .trim()
      .notEmpty()
      .withMessage('Course id must be filled out'),
  ],
  validateRequest,
  async (req, res) => {
    const { id } = req.params;
    const { users_id, course_id } = req.body;
    const userCourses = await userCourse.findOneAndUpdate(
      { _id: id },
      { users_id, course_id },
      { new: true }
    );

    if (!userCourses) {
      throw new BadRequestError(`User course with id: ${id} not found`);
    }

    res.status(200).send({ userCourses });
  }
);

// Delete a user course by id
router.delete(
  '/api/v1/user-courses/:id',
  currentUser,
  requireAuth,
  validateRequest,
  async (req, res) => {
    const { id } = req.params;
    const userCourses = await userCourse.findOneAndRemove({ _id: id });

    if (!userCourses) {
      throw new BadRequestError(`User course with id: ${id} not found`);
    }

    res.status(200).send({ message: `User course with id: ${id} deleted` });
  }
);

export { router as userCourseRouter };
