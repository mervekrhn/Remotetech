import { Request, Response } from 'express';
import QuestionTime from '../models/questionTime';

export const saveQuestionTime = async (req: Request, res: Response) => {
  const { interviewId, userId, questionId, startTime, endTime } = req.body;

  try {
    const newQuestionTime = new QuestionTime({
      interviewId,
      userId,
      questionId,
      startTime,
      endTime,
    });

    await newQuestionTime.save();
    res.status(201).json(newQuestionTime);
  } catch (error) {
    console.error("Error saving question time:", error);
    res.status(500).json({ error: "An error occurred while saving question time." });
  }
};

export const getQuestionTimesForUser = async (req: Request, res: Response) => {
  const { interviewId, userId } = req.params;

  try {
    const questionTimes = await QuestionTime.find({ interviewId, userId });
    res.status(200).json(questionTimes);
  } catch (error) {
    console.error("Error fetching question times:", error);
    res.status(500).json({ error: "An error occurred while fetching question times." });
  }
};
