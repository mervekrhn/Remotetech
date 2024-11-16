import multer from 'multer';
import { Router } from 'express';
import { uploadMedia , getMediaInfo, getVideoById, deleteMedia } from '../controllers/media-controller';

const router = Router();
const upload = multer(); // Multer'ı kullanarak dosya yüklemeyi tanımlıyoruz

// POST isteği: Dosya alanı 'file' olarak tanımlı
router.post('/media/:userId', upload.single('file'), uploadMedia);
router.post('/video-url', getVideoById);


router.get('/interviews/:interviewId/videos', getMediaInfo);
router.delete('/videos/:videoId', deleteMedia);

export default router;