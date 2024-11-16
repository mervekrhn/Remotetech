import express from 'express';
import { saveQuestionTime, getQuestionTimesForUser } from '../controllers/questionTimeController';

const router = express.Router();

// Soru başlangıç ve bitiş zamanını kaydetmek için
router.post('/interviews/:interviewId/users/:userId/question-times', saveQuestionTime);

// Belirli bir kullanıcı için soru zamanlarını getirmek için
router.get('/interviews/:interviewId/users/:userId/question-times', getQuestionTimesForUser);

export default router;
