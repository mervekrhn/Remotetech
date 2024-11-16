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
exports.deleteQuestionPackage = exports.updateQuestionPackage = exports.getQuestionPackages = exports.createQuestionPackage = void 0;
const question_1 = __importDefault(require("../models/question"));
const createQuestionPackage = (packageName, questions, questions_time) => __awaiter(void 0, void 0, void 0, function* () {
    const questionPackage = new question_1.default({ packageName, questions, questions_time });
    return yield questionPackage.save();
});
exports.createQuestionPackage = createQuestionPackage;
const getQuestionPackages = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield question_1.default.find();
});
exports.getQuestionPackages = getQuestionPackages;
const updateQuestionPackage = (id, packageName, questions) => __awaiter(void 0, void 0, void 0, function* () {
    return yield question_1.default.findByIdAndUpdate(id, { packageName, questions }, { new: true });
});
exports.updateQuestionPackage = updateQuestionPackage;
const deleteQuestionPackage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield question_1.default.findByIdAndDelete(id);
});
exports.deleteQuestionPackage = deleteQuestionPackage;
