import express from 'express';
import { createRepair, deleteRepair, findAllRepairs, findOneRepair, updateRepair } from './repairs.controller.js';
import { validateExistRepair, validateRolUser } from './repairs.middleware.js';
import { protect } from '../users/users.middleware.js';

export const router = express.Router();

router
  .route('/')
  .get(protect, validateRolUser, findAllRepairs)
  .post(createRepair)


router
  .route('/:id')
  .get(protect, validateRolUser, validateExistRepair, findOneRepair)
  .patch(protect,validateRolUser, validateExistRepair, updateRepair)
  .delete(protect,validateRolUser, validateExistRepair, deleteRepair) 
