import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import interviewRoutes from './routes/interviewRoutes';
import questionPackageRoutes from './routes/question';
import userRoutes from './routes/user';  
import questionTimeRoutes from './routes/questionTimeRoutes';
import { authMiddleware } from './middleware/authMiddleware';  // Middleware importu
import media from "./routes/media"
dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: ['https://remoteadmin.vercel.app','https://remoteuser.vercel.app','https://remotenewadmin.vercel.app'], // Frontend'in çalıştığı portları burada belirtin
  credentials: true,  // Eğer frontend'den cookie gönderiyorsanız bunu kullanın
  }));
app.use(express.json());
app.use(cookieParser());

// Auth, Interview ve QuestionPackage rotalarını ekleyin
app.use('/api/auth', authRoutes);
app.use('/api/interviews',interviewRoutes);
app.use('/api/question-package', authMiddleware,questionPackageRoutes);
app.use('/api/users',userRoutes); 
app.use('/api/upload' , media) 
app.use('/api', questionTimeRoutes);
app.options('*', cors()); // OPTIONS isteği için izin ver

// Basit bir test rotası
app.get('/', (_req, res) => {
    res.send('API is running...');
});

// Sunucu portunu dinleme
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));