"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteMedia = exports.getVideoById = exports.getMediaInfo = exports.uploadMedia = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const dotenv = __importStar(require("dotenv"));
const user_1 = __importDefault(require("../models/user"));
dotenv.config(); // .env dosyasındaki değerleri yüklüyoruz
const uploadMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { AWS_SECRET_ACCESS_KEY, BUCKET_NAME, Project, Link } = process.env;
    const { userId } = req.params; // URL'den formId'yi alıyoruz
    const mediaFile = req.file; // 'file' alanı adıyla gelen dosyayı alıyoruz
    if (!mediaFile) {
        res.status(400).json({ error: 'No media file provided.' });
        return;
    }
    // FormData oluşturulması
    const form = new form_data_1.default();
    form.append('file', mediaFile.buffer, mediaFile.originalname); // Dosyayı ekliyoruz
    form.append('bucket', BUCKET_NAME); // .env'den gelen BUCKET_NAME
    form.append('project', Project); // .env'den gelen Project adı
    form.append('accessKey', AWS_SECRET_ACCESS_KEY); // .env'den gelen secret key
    try {
        // Medya dosyasını harici servise yükleme
        const response = yield axios_1.default.post(Link, form, {
            headers: Object.assign({}, form.getHeaders()),
        });
        console.log("Response from media service:", response.data);
        // Harici medya servisinden dönen ID'yi alın (dosya listesi içindeki fileId'den)
        const videoId = (_b = (_a = response.data.files) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.fileId; // Dönüş verisinden videoId alın
        console.log("Extracted videoId:", videoId);
        if (!videoId) {
            throw new Error('Video ID not found in media service response.');
        }
        // Formu güncelleme: videoId'yi formun videoId alanına ekleyin
        const updatedForm = yield user_1.default.findByIdAndUpdate(userId, { videoId: videoId }, // videoId alanını güncelleme
        { new: true });
        if (!updatedForm) {
            res.status(404).json({ message: 'Form not found' });
            return;
        }
        // Başarılı yükleme durumunda geri dön
        res.status(200).json({
            message: 'Media successfully uploaded and form updated with videoId',
            updatedForm,
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: 'An error occurred during media upload or form update',
            error: error.message, // error'ın mesajına güvenebilirsiniz
        });
    }
});
exports.uploadMedia = uploadMedia;
const getMediaInfo = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { AWS_SECRET_ACCESS_KEY, BUCKET_NAME, Project, Link } = process.env;
    // Dinamik URL oluşturulması
    const url = `${Link}/${Project}/${BUCKET_NAME}/${AWS_SECRET_ACCESS_KEY}`;
    console.log("GET Request URL:", url);
    try {
        // GET isteği gönderiyoruz
        const response = yield axios_1.default.get(url);
        // Başarılı istek durumunda client'e geri dönüş
        res.status(200).json({
            message: 'GET request to external service was successful',
            data: response.data, // Harici servisten gelen yanıt
        });
    }
    catch (error) {
        // Hata durumunda error değişkenini Error tipine dönüştürme
        if (axios_1.default.isAxiosError(error)) {
            console.error('Error making GET request to external service:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            res.status(500).json({
                message: 'GET request to external service failed',
                error: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message,
            });
        }
        else {
            console.error('Unknown error making GET request to external service:', error);
            res.status(500).json({
                message: 'An unknown error occurred during GET request',
            });
        }
    }
});
exports.getMediaInfo = getMediaInfo;
const getVideoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { videoId } = req.body; // Body'den videoId alıyoruz
    const { AWS_SECRET_ACCESS_KEY, BUCKET_NAME, Project, Link } = process.env;
    if (!videoId) {
        res.status(400).json({ message: 'No videoId provided' });
        return;
    }
    try {
        // videoId'ye göre video bilgilerini almak için .env'den aldığımız Link'i kullanıyoruz
        const response = yield axios_1.default.get(`${Link}/${Project}/${BUCKET_NAME}/${AWS_SECRET_ACCESS_KEY}/${videoId}`);
        const videoUrl = (_a = response.data) === null || _a === void 0 ? void 0 : _a.url; // Video URL'sini alıyoruz
        if (!videoUrl) {
            res.status(404).json({ message: 'Video not found' });
            return;
        }
        res.status(200).json({
            message: 'Video URL fetched successfully',
            videoUrl,
        });
    }
    catch (error) {
        console.error('Error fetching video URL:', error);
        res.status(500).json({ message: 'Error fetching video URL', error });
    }
});
exports.getVideoById = getVideoById;
const deleteMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const videoId = req.params.videoId.trim(); // Gereksiz boşlukları kaldır
    const { Link, Project, BUCKET_NAME, AWS_SECRET_ACCESS_KEY } = process.env;
    console.log(`Silinmek istenen video ID: ${videoId}`);
    try {
        const response = yield axios_1.default.delete(`${Link}/${Project}/${BUCKET_NAME}/${AWS_SECRET_ACCESS_KEY}/${videoId}`);
        console.log(`Video ${videoId} başarıyla silindi`);
        res.status(200).json({ message: 'Video başarıyla silindi' });
    }
    catch (error) {
        console.error('Video silme hatası:');
        res.status(500).json({ message: 'Video silinirken bir hata oluştu' });
    }
});
exports.deleteMedia = deleteMedia;
