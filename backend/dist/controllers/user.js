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
exports.updateUserAlert = exports.deleteUser = exports.updateUser = exports.getUsers = exports.createUserAndAssignToInterview = void 0;
const userService = __importStar(require("../services/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const interview_1 = require("../services/interview");
// Yeni kullanıcı oluşturma
const createUserAndAssignToInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phone, kvkkAccepted } = req.body;
        const { interviewId } = req.params;
        const newUser = yield userService.createUserAndAssignToInterview(firstName, lastName, email, phone, kvkkAccepted, new mongoose_1.default.Types.ObjectId(interviewId));
        res.status(201).json({ message: 'User created and associated with the interview', user: newUser });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error creating user or associating with interview', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Error creating user or associating with interview', error: 'Unknown error' });
        }
    }
});
exports.createUserAndAssignToInterview = createUserAndAssignToInterview;
// Tüm kullanıcıları listeleme
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userService.getUsers();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});
exports.getUsers = getUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { notes, status, interviewId } = req.body;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID format' });
            return;
        }
        const watched = status === 'Passed' || status === 'Failed';
        const updatedUser = yield user_1.default.findByIdAndUpdate(userId, { notes, status, watched }, { new: true });
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // İzleme durumunu güncelledikten sonra Interview modelindeki sayacı güncelle
        yield (0, interview_1.updateVideoCountsForInterview)(interviewId);
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const trimmedUserId = userId.trim();
        // ObjectId formatında olup olmadığını kontrol edin
        if (!mongoose_1.default.Types.ObjectId.isValid(trimmedUserId)) {
            res.status(400).json({ message: 'Invalid user ID format' });
            return;
        }
        const deletedUser = yield user_1.default.findByIdAndDelete(trimmedUserId);
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted', deletedUser });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
});
exports.deleteUser = deleteUser;
// Kullanıcı uyarı durumunu güncelleme
const updateUserAlert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { alert } = req.body;
    try {
        // Veritabanında kullanıcıyı bul ve alert alanını güncelle
        const updatedUser = yield user_1.default.findByIdAndUpdate(userId, { alert: alert }, { new: true } // Güncellenmiş kullanıcıyı döndür
        );
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Alert status updated successfully', user: updatedUser });
    }
    catch (error) {
        console.error('Error updating alert status:', error);
        res.status(500).json({ message: 'Error updating alert status', error });
    }
});
exports.updateUserAlert = updateUserAlert;
