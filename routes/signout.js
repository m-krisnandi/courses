import express from 'express';

const router = express.Router();

router.post('/api/v1/admin/signout', (req, res) => {
  req.session = null;

  res.send({ message: 'You are logged out' });
});

export { router as signoutRouter };
