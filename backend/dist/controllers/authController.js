"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || 'your_jwt_secret';
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const payload = { email, role: 'admin' }; // Rol bilgisi ekleniyor
        // JWT token oluştur
        const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '1h' });
        // JWT token'ı cookie'de ayarlayın
        res.cookie('token', token, {
            httpOnly: true, // JavaScript erişimini engeller (XSS saldırılarına karşı)
            secure: false, // Localhost için HTTPS gerekmez, bu yüzden secure: false olmalı
            maxAge: 6 * 60 * 60 * 1000, // 6 saat geçerli
            sameSite: 'lax', // CSRF koruması için sameSite ayarı
        });
        // Başarılı giriş mesajı ve token döndür
        res.status(200).json({ message: 'Giriş başarılı', token });
    }
    catch (error) {
        console.error('Giriş hatası:', error); // Hata durumunda loglama
        res.status(500).json({ message: 'Sunucu hatası, lütfen tekrar deneyin' }); // Genel bir sunucu hatası döndürülüyor
        // next(error); // Hata fırlatma yerine doğrudan yönetim yapıyoruz
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token');
    res.status(200).json({ message: 'Çıkış başarılı' });
});
exports.logout = logout;
