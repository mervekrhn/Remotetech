import QuestionPackage, { IQuestionPackage } from '../models/question';

export const createQuestionPackage = async (packageName: string, questions: string[], questions_time: number,): Promise<IQuestionPackage> => {
  const questionPackage = new QuestionPackage({ packageName, questions,questions_time });
  return await questionPackage.save();
};

export const getQuestionPackages = async (): Promise<IQuestionPackage[]> => {
  return await QuestionPackage.find();
};

export const updateQuestionPackage = async (id: string, packageName: string, questions: string[]): Promise<IQuestionPackage | null> => {
  return await QuestionPackage.findByIdAndUpdate(id, { packageName, questions }, { new: true });
};

export const deleteQuestionPackage = async (id: string): Promise<IQuestionPackage | null> => {
  return await QuestionPackage.findByIdAndDelete(id);
};
