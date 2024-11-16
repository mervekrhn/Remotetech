"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Token'ı cookie'den al
    if (!token) {
        res.status(401).json({ message: 'Erişim reddedildi. Token gerekli.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded;
        next(); // Token doğrulandıysa bir sonraki middleware'e geçiyoruz
    }
    catch (error) {
        res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token.' });
        return;
    }
};
exports.authMiddleware = authMiddleware;
