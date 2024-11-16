"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const media_controller_1 = require("../controllers/media-controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)(); // Multer'ı kullanarak dosya yüklemeyi tanımlıyoruz
// POST isteği: Dosya alanı 'file' olarak tanımlı
router.post('/media/:userId', upload.single('file'), media_controller_1.uploadMedia);
router.post('/video-url', media_controller_1.getVideoById);
router.get('/interviews/:interviewId/videos', media_controller_1.getMediaInfo);
router.delete('/videos/:videoId', media_controller_1.deleteMedia);
exports.default = router;
