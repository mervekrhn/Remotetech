import express from 'express';
import {
  createPackage,
  getPackages,
  updatePackage,
  deletePackage,
} from '../controllers/question';

const router = express.Router();

// Define routes
router.post('/create', createPackage);
router.get('/list', getPackages);
router.put('/update/:id', updatePackage); // Update route with dynamic id parameter
router.delete('/delete/:id', deletePackage); // Delete route with dynamic id parameter

export default router;
