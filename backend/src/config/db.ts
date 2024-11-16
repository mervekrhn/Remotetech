import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();  // .env dosyasını yükler

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);  // MONGO_URI'yi kullanıyoruz
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
