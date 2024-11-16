import Interview, { IInterview } from '../models/interview';

export const createInterview = async (
  title: string, packages: string[], expireDate: Date, canSkip: boolean, showAtOnce: boolean
): Promise<IInterview> => {
  const interview = new Interview({
    title,
    packages,
    expireDate,
    canSkip,
    showAtOnce,
    
  });

  return await interview.save().then(i => i.populate('packages', 'packageName'));
};

export const getInterviews = async (): Promise<IInterview[]> => {
  return await Interview.find().populate({
    path: 'packages',
    populate: {
      path: 'questions', // Paket içindeki questions alanını popüle ediyoruz
      select: 'questionText question_time', // Yalnızca question metnini getiriyoruz
    }
  });
};

export const getAllInterviewIds = async (): Promise<string[]> => {
  // Find all interviews and return only their _id fields
  const interviews = await Interview.find({}, '_id');
  return interviews.map(interview => interview.id.toString());
};

export const updateInterview = async (
  id: string,
  title: string,
  packages: string[],
  expireDate: Date,
  canSkip: boolean,
  showAtOnce: boolean,
  
): Promise<IInterview | null> => {
  return await Interview.findByIdAndUpdate(
    id,
    { title, packages, expireDate, canSkip, showAtOnce },
    { new: true }
  ).populate('packages');
};

export const deleteInterview = async (id: string): Promise<IInterview | null> => {
  return await Interview.findByIdAndDelete(id);
};

export const getInterviewQuestions = async (interviewId: string): Promise<any> => {
  // Interview verisini id ile bul ve soruları çek
  const interview = await Interview.findById(interviewId)
    .populate({
      path: 'packages',
      populate: {
        path: 'questions', // Paket içindeki 'questions' alanını popüle ediyoruz
        select: 'questionText questionTime' // Yalnızca question metnini ve zamanını getiriyoruz
      }
    });

  // Interview bulunamadıysa hata fırlat
  if (!interview) {
    throw new Error('Interview not found');
  }

  // Interview'de package yoksa boş array döndür
  if (!interview.packages || !Array.isArray(interview.packages)) {
    return [];
  }

  // Paket içindeki soruların listesini döndür
  const questions = interview.packages
    .filter((pkg: any) => Array.isArray(pkg.questions)) // Sadece questions alanı olanları filtrele
    .map((pkg: any) => pkg.questions)
    .flat();

  return questions;
};
export const updateVideoCountsForInterview = async (interviewId: string) => {
  try {
    const interview = await Interview.findById(interviewId).populate('userId');
    
    if (!interview) throw new Error('Interview not found');

    const users = interview.userId as any[];

    interview.totalVideos = users.length;
    interview.onHoldVideos = users.filter((user) => !user.watched).length;

    await interview.save();
  } catch (error) {
    console.error('Error updating video counts:', error);
  }
};
