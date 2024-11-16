import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your_jwt_secret';
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // E-posta ve şifre doğrulaması
    if (!email || !password) {
      res.status(400).json({ message: 'Email ve şifre gereklidir' });
      return;
    }

    if (email !== adminEmail || password !== adminPassword) {
      res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
      return;
    }

    // Kullanıcı bilgilerini JWT token'ına ekleyin
    const payload = { email, role: 'admin' };  // Rol bilgisi ekleniyor

    // JWT token oluştur
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    // JWT token'ı cookie'de ayarlayın
    res.cookie('token', token, {
      httpOnly: true,  // JavaScript erişimini engeller (XSS saldırılarına karşı)
      secure: false,  // Localhost için HTTPS gerekmez, bu yüzden secure: false olmalı
      maxAge: 6 * 60 * 60 * 1000,  // 6 saat geçerli
      sameSite: 'lax',  // CSRF koruması için sameSite ayarı
    });
    

    // Başarılı giriş mesajı ve token döndür
    res.status(200).json({ message: 'Giriş başarılı', token });
    
  } catch (error) {
    console.error('Giriş hatası:', error);  // Hata durumunda loglama
    res.status(500).json({ message: 'Sunucu hatası, lütfen tekrar deneyin' });  // Genel bir sunucu hatası döndürülüyor
    // next(error); // Hata fırlatma yerine doğrudan yönetim yapıyoruz
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Çıkış başarılı' });
};