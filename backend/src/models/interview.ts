import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
  title: string;
  packages: mongoose.Schema.Types.ObjectId[]; // To reference question packages
  userId: mongoose.Schema.Types.ObjectId[]; // Kullanıcı referansı (User ID)
  expireDate: Date;
  canSkip: boolean;
  showAtOnce: boolean;
  totalVideos: number;
  onHoldVideos: number;
}

const interviewSchema = new Schema<IInterview>({
  title: { type: String, required: true },
  packages: [{ type: Schema.Types.ObjectId, ref: 'QuestionPackage', required: true }], // Referencing Question Packages
  userId: [{ type: Schema.Types.ObjectId, ref: 'User' }], // User referansı ekleyin
  expireDate: { type: Date, required: true },
  canSkip: { type: Boolean, default: false },
  showAtOnce: { type: Boolean, default: false },
  totalVideos: { type: Number, default: 0 },
  onHoldVideos: { type: Number, default: 0 },
});

const Interview = mongoose.model<IInterview>('Interview', interviewSchema);
export default Interview;
