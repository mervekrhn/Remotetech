"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
// Define routes
router.post('/create/:interviewId', user_1.createUserAndAssignToInterview); // Yeni kullanıcı oluştur
router.get('/list', user_1.getUsers); // Tüm kullanıcıları listele
router.delete('/delete/:userId', user_1.deleteUser); // Kullanıcı sil
router.put('/:userId', user_1.updateUser); // PUT endpointini ekleyin
router.put('/:userId/alert', user_1.updateUserAlert); // Yeni endpoint
exports.default = router;
