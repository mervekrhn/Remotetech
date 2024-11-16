import { Request, Response , NextFunction } from 'express';
import * as interviewService from '../services/interview';
import Interview from '../models/interview';
import mongoose from 'mongoose';

export const createInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, packages, expireDate, canSkip, showAtOnce } = req.body;
    const interview = await interviewService.createInterview(title, packages, expireDate, canSkip, showAtOnce);
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating interview', error });
  }
};

export const getInterviews = async (_req: Request, res: Response): Promise<void> => {
  try {
    const interviews = await Interview.find()
      .populate({
        path: 'packages',
        populate: {
          path: 'questions',
          select: 'questionText questionTime' // Yalnızca gerekli alanları getiriyoruz
        }
      })
      .populate({
        path: 'userId',
        select: 'videoId watched' // Sadece videoId ve watched alanlarını getiriyoruz
      })
      .lean(); // lean() ile düz JavaScript objesi alıyoruz

    // Kullanıcı bilgileri üzerinden totalVideos ve onHold hesaplama
    const interviewWithVideoCounts = interviews.map((interview) => {
      const users = interview.userId as any[];

      return {
        ...interview,
        totalVideos: users.filter((user) => user.videoId).length, // Toplam video sayısı
        onHold: users.filter((user) => user.videoId && user.watched === false).length, // İzlenmemiş videolar
      };
    });

    res.status(200).json(interviewWithVideoCounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interviews', error });
  }
};

export const getAllInterviewIds = async (_req: Request, res: Response): Promise<void> => {
  try {
    const interviewIds = await interviewService.getAllInterviewIds();
    res.status(200).json(interviewIds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interview IDs', error });
  }
};

export const updateInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, packages, expireDate, canSkip, showAtOnce } = req.body;
    const interview = await interviewService.updateInterview(id, title, packages, expireDate, canSkip, showAtOnce);
    if (!interview) {
      res.status(404).json({ message: 'Interview not found' });
      return;
    }
    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating interview', error });
  }
};

export const deleteInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const interview = await interviewService.deleteInterview(id);
    if (!interview) {
      res.status(404).json({ message: 'Interview not found' });
      return;
    }
    res.status(200).json({ message: 'Interview deleted', interview });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting interview', error });
  }
};

export const getInterviewQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interviewId } = req.params;
    const questions = await interviewService.getInterviewQuestions(interviewId);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interview questions' });
  }
};

// Interview statüsünü kontrol eden fonksiyon
export const checkInterviewStatus = async (req: Request, res: Response): Promise<void> => {
  const { interviewId } = req.params;
  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      res.status(404).json({ message: 'Interview not found' });
      return;
    }

    const currentDate = new Date();
    const expireDate = new Date(interview.expireDate);

    if (expireDate > currentDate) {
      res.status(200).json({ status: 'published', message: 'Interview is published and active.' });
    } else {
      res.status(200).json({ status: 'unpublished', message: 'Interview has expired.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking interview status', error });
  }
};
export const getPersonalFormsByInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { interviewId } = req.params;
  try {
    // Interview verisini populate kullanarak personalInformationForms ile çekiyoruz
    const interview = await Interview.findById(interviewId).populate('userId');
    if (!interview) {
      // Bu satırın dönüş tipi Response olsa bile, Promise<void> olarak döneceğiz.
      res.status(404).json({ message: 'Interview not found' });
      return; // return ile fonksiyonun işlemini bitiriyoruz.
    }
    // Eğer interview bulunduysa, personalInformationForms verisini döndürüyoruz
    res.status(200).json({ userId: interview.userId });
  } catch (error) {
    next(error);  // Hata oluşursa, error handling middleware'ine yönlendirme
  }
};




export const removeUserFromInterview = async (req: Request, res: Response): Promise<void> => {
  const {  userId } = req.params;
  const {  interviewId } = req.params;


  // Geçerli ObjectId formatı kontrolü ve çevrim işlemi
  let interviewObjectId, userObjectId;
  try {
    if (!mongoose.Types.ObjectId.isValid(interviewId) || !mongoose.Types.ObjectId.isValid(userId)) {
       res.status(400).json({ message: 'Invalid Interview ID or User ID format' });
  }
    interviewObjectId = new mongoose.Types.ObjectId(interviewId);
    userObjectId = new mongoose.Types.ObjectId(userId);
  } catch (error) {
    res.status(400).json({ message: 'Invalid Interview ID or User ID format' });
    return;
  }

  try {
    // Kullanıcıyı Interview'den kaldırma
    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewObjectId,
      { $pull: { userId: userObjectId } }, // userId'yi Interview'den kaldırıyoruz
      { new: true }
    );

    if (!updatedInterview) {
      res.status(404).json({ message: 'Interview not found' });
      return;
    }

    res.status(200).json({ message: 'User removed from interview', updatedInterview });
  } catch (error) {
    console.error('Error removing user from interview:', error);
    res.status(500).json({ message: 'Error removing user from interview', error });
  }
};
export const updateVideoCountsForInterview = async (interviewId: string) => {
  try {
    const interview = await Interview.findById(interviewId).populate('userId');
    
    if (!interview) throw new Error('Interview not found');

    const users = interview.userId as any[];

    // Toplam video sayısı ve izlenmemiş videoları güncelle
    interview.totalVideos = users.length;
    interview.onHoldVideos = users.filter((user) => !user.watched).length;

    await interview.save();
  } catch (error) {
    console.error('Error updating video counts:', error);
  }
};
