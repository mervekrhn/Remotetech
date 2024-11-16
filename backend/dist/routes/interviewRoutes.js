"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware"); // Middleware importu
const interviewController_1 = require("../controllers/interviewController");
const router = express_1.default.Router();
// Define routes
router.post('/create', authMiddleware_1.authMiddleware, interviewController_1.createInterview);
router.get('/list', authMiddleware_1.authMiddleware, interviewController_1.getInterviews);
router.put('/update/:id', authMiddleware_1.authMiddleware, interviewController_1.updateInterview);
router.delete('/delete/:id', authMiddleware_1.authMiddleware, interviewController_1.deleteInterview);
router.get('/interview-ids', interviewController_1.getAllInterviewIds);
router.get('/:interviewId/questions', interviewController_1.getInterviewQuestions);
router.get('/interview-ids/:interviewId', interviewController_1.checkInterviewStatus);
router.get('/:interviewId/personal-forms', interviewController_1.getPersonalFormsByInterview);
router.put('/:interviewId/remove-user/:userId', interviewController_1.removeUserFromInterview);
exports.default = router;
