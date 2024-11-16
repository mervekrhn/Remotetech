import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  password: string;
  email: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;  // Token'ı cookie'den al

  if (!token) {
    res.status(401).json({ message: 'Erişim reddedildi. Token gerekli.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as JwtPayload;
    (req as any).user = decoded;
    next(); // Token doğrulandıysa bir sonraki middleware'e geçiyoruz
  } catch (error) {
    res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token.' });
    return;
  }
};
