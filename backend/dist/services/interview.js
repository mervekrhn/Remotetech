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
exports.updateVideoCountsForInterview = exports.getInterviewQuestions = exports.deleteInterview = exports.updateInterview = exports.getAllInterviewIds = exports.getInterviews = exports.createInterview = void 0;
const interview_1 = __importDefault(require("../models/interview"));
const createInterview = (title, packages, expireDate, canSkip, showAtOnce) => __awaiter(void 0, void 0, void 0, function* () {
    const interview = new interview_1.default({
        title,
        packages,
        expireDate,
        canSkip,
        showAtOnce,
    });
    return yield interview.save().then(i => i.populate('packages', 'packageName'));
});
exports.createInterview = createInterview;
const getInterviews = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield interview_1.default.find().populate({
        path: 'packages',
        populate: {
            path: 'questions', // Paket içindeki questions alanını popüle ediyoruz
            select: 'questionText question_time', // Yalnızca question metnini getiriyoruz
        }
    });
});
exports.getInterviews = getInterviews;
const getAllInterviewIds = () => __awaiter(void 0, void 0, void 0, function* () {
    // Find all interviews and return only their _id fields
    const interviews = yield interview_1.default.find({}, '_id');
    return interviews.map(interview => interview.id.toString());
});
exports.getAllInterviewIds = getAllInterviewIds;
const updateInterview = (id, title, packages, expireDate, canSkip, showAtOnce) => __awaiter(void 0, void 0, void 0, function* () {
    return yield interview_1.default.findByIdAndUpdate(id, { title, packages, expireDate, canSkip, showAtOnce }, { new: true }).populate('packages');
});
exports.updateInterview = updateInterview;
const deleteInterview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield interview_1.default.findByIdAndDelete(id);
});
exports.deleteInterview = deleteInterview;
const getInterviewQuestions = (interviewId) => __awaiter(void 0, void 0, void 0, function* () {
    // Interview verisini id ile bul ve soruları çek
    const interview = yield interview_1.default.findById(interviewId)
        .populate({
        path: 'packages',
        populate: {
            path: 'questions', // Paket içindeki 'questions' alanını popüle ediyoruz
            select: 'questionText questionTime' // Yalnızca question metnini ve zamanını getiriyoruz
        }
    });
    // Interview bulunamadıysa hata fırlat
    if (!interview) {
        throw new Error('Interview not found');
    }
    // Interview'de package yoksa boş array döndür
    if (!interview.packages || !Array.isArray(interview.packages)) {
        return [];
    }
    // Paket içindeki soruların listesini döndür
    const questions = interview.packages
        .filter((pkg) => Array.isArray(pkg.questions)) // Sadece questions alanı olanları filtrele
        .map((pkg) => pkg.questions)
        .flat();
    return questions;
});
exports.getInterviewQuestions = getInterviewQuestions;
const updateVideoCountsForInterview = (interviewId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interview = yield interview_1.default.findById(interviewId).populate('userId');
        if (!interview)
            throw new Error('Interview not found');
        const users = interview.userId;
        interview.totalVideos = users.length;
        interview.onHoldVideos = users.filter((user) => !user.watched).length;
        yield interview.save();
    }
    catch (error) {
        console.error('Error updating video counts:', error);
    }
});
exports.updateVideoCountsForInterview = updateVideoCountsForInterview;
