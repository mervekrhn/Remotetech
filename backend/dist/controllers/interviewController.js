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
exports.updateVideoCountsForInterview = exports.removeUserFromInterview = exports.getPersonalFormsByInterview = exports.checkInterviewStatus = exports.getInterviewQuestions = exports.deleteInterview = exports.updateInterview = exports.getAllInterviewIds = exports.getInterviews = exports.createInterview = void 0;
const interviewService = __importStar(require("../services/interview"));
const interview_1 = __importDefault(require("../models/interview"));
const mongoose_1 = __importDefault(require("mongoose"));
const createInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, packages, expireDate, canSkip, showAtOnce } = req.body;
        const interview = yield interviewService.createInterview(title, packages, expireDate, canSkip, showAtOnce);
        res.status(201).json(interview);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating interview', error });
    }
});
exports.createInterview = createInterview;
const getInterviews = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interviews = yield interview_1.default.find()
            .populate({
            path: 'packages',
            populate: {
                path: 'questions',
                select: 'questionText questionTime' // Yalnızca gerekli alanları getiriyoruz
            }
        })
            .populate({
            path: 'userId',
            select: 'videoId watched' // Sadece videoId ve watched alanlarını getiriyoruz
        })
            .lean(); // lean() ile düz JavaScript objesi alıyoruz
        // Kullanıcı bilgileri üzerinden totalVideos ve onHold hesaplama
        const interviewWithVideoCounts = interviews.map((interview) => {
            const users = interview.userId;
            return Object.assign(Object.assign({}, interview), { totalVideos: users.filter((user) => user.videoId).length, onHold: users.filter((user) => user.videoId && user.watched === false).length });
        });
        res.status(200).json(interviewWithVideoCounts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching interviews', error });
    }
});
exports.getInterviews = getInterviews;
const getAllInterviewIds = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interviewIds = yield interviewService.getAllInterviewIds();
        res.status(200).json(interviewIds);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching interview IDs', error });
    }
});
exports.getAllInterviewIds = getAllInterviewIds;
const updateInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, packages, expireDate, canSkip, showAtOnce } = req.body;
        const interview = yield interviewService.updateInterview(id, title, packages, expireDate, canSkip, showAtOnce);
        if (!interview) {
            res.status(404).json({ message: 'Interview not found' });
            return;
        }
        res.status(200).json(interview);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating interview', error });
    }
});
exports.updateInterview = updateInterview;
const deleteInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const interview = yield interviewService.deleteInterview(id);
        if (!interview) {
            res.status(404).json({ message: 'Interview not found' });
            return;
        }
        res.status(200).json({ message: 'Interview deleted', interview });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting interview', error });
    }
});
exports.deleteInterview = deleteInterview;
const getInterviewQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { interviewId } = req.params;
        const questions = yield interviewService.getInterviewQuestions(interviewId);
        res.status(200).json(questions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching interview questions' });
    }
});
exports.getInterviewQuestions = getInterviewQuestions;
// Interview statüsünü kontrol eden fonksiyon
const checkInterviewStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { interviewId } = req.params;
    try {
        const interview = yield interview_1.default.findById(interviewId);
        if (!interview) {
            res.status(404).json({ message: 'Interview not found' });
            return;
        }
        const currentDate = new Date();
        const expireDate = new Date(interview.expireDate);
        if (expireDate > currentDate) {
            res.status(200).json({ status: 'published', message: 'Interview is published and active.' });
        }
        else {
            res.status(200).json({ status: 'unpublished', message: 'Interview has expired.' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error checking interview status', error });
    }
});
exports.checkInterviewStatus = checkInterviewStatus;
const getPersonalFormsByInterview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { interviewId } = req.params;
    try {
        // Interview verisini populate kullanarak personalInformationForms ile çekiyoruz
        const interview = yield interview_1.default.findById(interviewId).populate('userId');
        if (!interview) {
            // Bu satırın dönüş tipi Response olsa bile, Promise<void> olarak döneceğiz.
            res.status(404).json({ message: 'Interview not found' });
            return; // return ile fonksiyonun işlemini bitiriyoruz.
        }
        // Eğer interview bulunduysa, personalInformationForms verisini döndürüyoruz
        res.status(200).json({ userId: interview.userId });
    }
    catch (error) {
        next(error); // Hata oluşursa, error handling middleware'ine yönlendirme
    }
});
exports.getPersonalFormsByInterview = getPersonalFormsByInterview;
const removeUserFromInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { interviewId } = req.params;
    // Geçerli ObjectId formatı kontrolü ve çevrim işlemi
    let interviewObjectId, userObjectId;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(interviewId) || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid Interview ID or User ID format' });
        }
        interviewObjectId = new mongoose_1.default.Types.ObjectId(interviewId);
        userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid Interview ID or User ID format' });
        return;
    }
    try {
        // Kullanıcıyı Interview'den kaldırma
        const updatedInterview = yield interview_1.default.findByIdAndUpdate(interviewObjectId, { $pull: { userId: userObjectId } }, // userId'yi Interview'den kaldırıyoruz
        { new: true });
        if (!updatedInterview) {
            res.status(404).json({ message: 'Interview not found' });
            return;
        }
        res.status(200).json({ message: 'User removed from interview', updatedInterview });
    }
    catch (error) {
        console.error('Error removing user from interview:', error);
        res.status(500).json({ message: 'Error removing user from interview', error });
    }
});
exports.removeUserFromInterview = removeUserFromInterview;
const updateVideoCountsForInterview = (interviewId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interview = yield interview_1.default.findById(interviewId).populate('userId');
        if (!interview)
            throw new Error('Interview not found');
        const users = interview.userId;
        // Toplam video sayısı ve izlenmemiş videoları güncelle
        interview.totalVideos = users.length;
        interview.onHoldVideos = users.filter((user) => !user.watched).length;
        yield interview.save();
    }
    catch (error) {
        console.error('Error updating video counts:', error);
    }
});
exports.updateVideoCountsForInterview = updateVideoCountsForInterview;
