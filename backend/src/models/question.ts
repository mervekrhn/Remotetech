import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionPackage extends Document {
  packageName: string;
  questions: {
    questionText: string;
    question_time: {
      hours: number;
      minutes: number;
      seconds: number;
    };
  }[];
}

const questionSchema = new Schema({
  questionText: { type: String, required: true },
  question_time: {
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true },
    seconds: { type: Number, required: true },
  },
});

const questionPackageSchema = new Schema<IQuestionPackage>({
  packageName: { type: String, required: true, unique: true },
  questions: [questionSchema],
});

const QuestionPackage = mongoose.model<IQuestionPackage>('QuestionPackage', questionPackageSchema);
export default QuestionPackage;
