import express from 'express';
import { register, deleteUser, findAllUsers, findOneUser, login, updateUser } from './users.controller.js';
import { protect, validateExistUser } from './users.middleware.js';

export const router = express.Router();

router.post('/register', register)

router.post('/login', login)

router.use(protect)

router.get('/', findAllUsers)

// router.use('/:id', validateExistUser) 
router
  .route('/:id')
  .get(validateExistUser, findOneUser)
  .patch(validateExistUser, updateUser)
  .delete(validateExistUser, deleteUser);


  