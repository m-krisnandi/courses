import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup.js';
import { signoutRouter } from './routes/signout';
import { signinRouter } from './routes/signin';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

import { courseCategoryRouter } from './routes/course-category';
import { courseRouter } from './routes/course';
import { userCourseRouter } from './routes/user-course';
import { userRouter } from './routes/user';

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.use(courseCategoryRouter);
app.use(courseRouter);
app.use(userCourseRouter);
app.use(userRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
