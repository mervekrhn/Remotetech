import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';  // Middleware importu

import {
  createInterview,
  getInterviews,
  updateInterview,
  deleteInterview,
  getAllInterviewIds, 
  getInterviewQuestions,
  checkInterviewStatus,
  getPersonalFormsByInterview,
  removeUserFromInterview

} from '../controllers/interviewController';

const router = express.Router();

// Define routes
router.post('/create',  authMiddleware , createInterview);
router.get('/list', getInterviews);
router.put('/update/:id', authMiddleware , updateInterview);
router.delete('/delete/:id', authMiddleware , deleteInterview);
router.get('/interview-ids', getAllInterviewIds);
router.get('/:interviewId/questions',getInterviewQuestions);
router.get('/interview-ids/:interviewId', checkInterviewStatus);
router.get('/:interviewId/personal-forms', getPersonalFormsByInterview);
router.put('/:interviewId/remove-user/:userId', removeUserFromInterview);



export default router;