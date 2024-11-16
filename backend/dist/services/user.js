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
exports.deleteUser = exports.getUsers = exports.getUserById = exports.createUserAndAssignToInterview = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const interview_1 = __importDefault(require("../models/interview"));
const createUserAndAssignToInterview = (firstName, lastName, email, phone, kvkkAccepted, interviewId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if interviewId is valid
    if (!mongoose_1.default.isValidObjectId(interviewId)) {
        throw new Error('Invalid Interview ID');
    }
    // Find the interview by interviewId
    const interview = yield interview_1.default.findById(interviewId);
    if (!interview) {
        throw new Error('Interview not found');
    }
    // Create a new user instance
    const newUser = new user_1.default({ firstName, lastName, email, phone, kvkkAccepted });
    // Save the new user to the database
    const savedUser = yield newUser.save();
    // Cast savedUser._id to mongoose.Schema.Types.ObjectId
    const userId = savedUser._id;
    // Add the new user's ID to the userId array in the interview
    interview.userId.push(userId);
    // Save the updated interview document
    yield interview.save();
    // Return the newly created user
    return savedUser;
});
exports.createUserAndAssignToInterview = createUserAndAssignToInterview;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findById(id);
});
exports.getUserById = getUserById;
// Tüm kullanıcıları listeleme
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.find();
});
exports.getUsers = getUsers;
// Belirli bir kullanıcıyı silme
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findByIdAndDelete(id);
});
exports.deleteUser = deleteUser;
