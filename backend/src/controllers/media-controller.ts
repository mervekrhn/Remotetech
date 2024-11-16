import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import * as dotenv from 'dotenv';
import User from '../models/user';

dotenv.config();  // .env dosyasındaki değerleri yüklüyoruz


export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  const { AWS_SECRET_ACCESS_KEY, BUCKET_NAME, Project, Link } = process.env;
  const { userId } = req.params;  // URL'den formId'yi alıyoruz
  const mediaFile = req.file; // 'file' alanı adıyla gelen dosyayı alıyoruz
  if (!mediaFile) {
    res.status(400).json({ error: 'No media file provided.' });
    return;
  }
  // FormData oluşturulması
  const form = new FormData();
  form.append('file', mediaFile.buffer, mediaFile.originalname); // Dosyayı ekliyoruz
  form.append('bucket', BUCKET_NAME as string); // .env'den gelen BUCKET_NAME
  form.append('project', Project as string); // .env'den gelen Project adı
  form.append('accessKey', AWS_SECRET_ACCESS_KEY as string); // .env'den gelen secret key
  try {
    // Medya dosyasını harici servise yükleme
    const response = await axios.post(Link as string, form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    console.log("Response from media service:", response.data);
    // Harici medya servisinden dönen ID'yi alın (dosya listesi içindeki fileId'den)
    const videoId = response.data.files?.[0]?.fileId;  // Dönüş verisinden videoId alın
    console.log("Extracted videoId:", videoId);
    if (!videoId) {
      throw new Error('Video ID not found in media service response.');
    }
    // Formu güncelleme: videoId'yi formun videoId alanına ekleyin
    const updatedForm = await User.findByIdAndUpdate(
      userId,
      { videoId: videoId },  // videoId alanını güncelleme
      { new: true }
    );
    if (!updatedForm) {
      res.status(404).json({ message: 'Form not found' });
      return;
    }
    // Başarılı yükleme durumunda geri dön
    res.status(200).json({
      message: 'Media successfully uploaded and form updated with videoId',
      updatedForm,
    });
  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'An error occurred during media upload or form update',
      error: error.message, // error'ın mesajına güvenebilirsiniz
    });
  }
};



export const getMediaInfo = async (_req: Request, res: Response): Promise<void> => {
  const { AWS_SECRET_ACCESS_KEY, BUCKET_NAME, Project, Link } = process.env;

  // Dinamik URL oluşturulması
  const url = `${Link}/${Project}/${BUCKET_NAME}/${AWS_SECRET_ACCESS_KEY}`;

  console.log("GET Request URL:", url);

  try {
    // GET isteği gönderiyoruz
    const response = await axios.get(url);

    // Başarılı istek durumunda client'e geri dönüş
    res.status(200).json({
      message: 'GET request to external service was successful',
      data: response.data, // Harici servisten gelen yanıt
    });
  } catch (error) {
    // Hata durumunda error değişkenini Error tipine dönüştürme
    if (axios.isAxiosError(error)) {
      console.error('Error making GET request to external service:', error.response?.data || error.message);
      res.status(500).json({
        message: 'GET request to external service failed',
        error: error.response?.data || error.message,
      });
    } else {
      console.error('Unknown error making GET request to external service:', error);
      res.status(500).json({
        message: 'An unknown error occurred during GET request',
      });
    }
  }
};

export const getVideoById = async (req: Request, res: Response): Promise<void> => {
  const { videoId } = req.body; // Body'den videoId alıyoruz
  const { AWS_SECRET_ACCESS_KEY, BUCKET_NAME, Project, Link } = process.env;
  if (!videoId) {
    res.status(400).json({ message: 'No videoId provided' });
    return; 
  }
  try {
    // videoId'ye göre video bilgilerini almak için .env'den aldığımız Link'i kullanıyoruz
    const response = await axios.get(`${Link}/${Project}/${BUCKET_NAME}/${AWS_SECRET_ACCESS_KEY}/${videoId}`);
    const videoUrl = response.data?.url; // Video URL'sini alıyoruz

    if (!videoUrl) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }

    res.status(200).json({
      message: 'Video URL fetched successfully',
      videoUrl,
    });
  } catch (error) {
    console.error('Error fetching video URL:', error);
    res.status(500).json({ message: 'Error fetching video URL', error });
  }
};



export const deleteMedia = async  (req: Request, res: Response): Promise<void>  => {
  const videoId = req.params.videoId.trim(); // Gereksiz boşlukları kaldır
  const { Link, Project, BUCKET_NAME, AWS_SECRET_ACCESS_KEY } = process.env;

  console.log(`Silinmek istenen video ID: ${videoId}`);

  try {
    const response = await axios.delete(`${Link}/${Project}/${BUCKET_NAME}/${AWS_SECRET_ACCESS_KEY}/${videoId}`);
    console.log(`Video ${videoId} başarıyla silindi`);
    res.status(200).json({ message: 'Video başarıyla silindi' });
  } catch (error) {
    console.error('Video silme hatası:');
    res.status(500).json({ message: 'Video silinirken bir hata oluştu' });
  }
};
