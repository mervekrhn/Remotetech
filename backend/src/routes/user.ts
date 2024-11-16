import express from 'express';
import {
  createUserAndAssignToInterview,
  getUsers,
  deleteUser,
  updateUser,
  updateUserAlert,
} from '../controllers/user';

const router = express.Router();

// Define routes
router.post('/create/:interviewId', createUserAndAssignToInterview);    // Yeni kullanıcı oluştur
router.get('/list', getUsers);         // Tüm kullanıcıları listele
router.delete('/delete/:userId', deleteUser);  // Kullanıcı sil
router.put('/:userId', updateUser); // PUT endpointini ekleyin
router.put('/:userId/alert', updateUserAlert); // Yeni endpoint

export default router;
