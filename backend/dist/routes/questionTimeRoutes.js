"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionTimeController_1 = require("../controllers/questionTimeController");
const router = express_1.default.Router();
// Soru başlangıç ve bitiş zamanını kaydetmek için
router.post('/interviews/:interviewId/users/:userId/question-times', questionTimeController_1.saveQuestionTime);
// Belirli bir kullanıcı için soru zamanlarını getirmek için
router.get('/interviews/:interviewId/users/:userId/question-times', questionTimeController_1.getQuestionTimesForUser);
exports.default = router;
