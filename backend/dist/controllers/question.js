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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePackage = exports.updatePackage = exports.getPackages = exports.createPackage = void 0;
const questionPackageService = __importStar(require("../services/question"));
// Create new question package
const createPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { packageName, questions, questions_time } = req.body;
        const newPackage = yield questionPackageService.createQuestionPackage(packageName, questions, questions_time);
        res.status(201).json(newPackage);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating package', error });
    }
});
exports.createPackage = createPackage;
// Get all question packages
const getPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const packages = yield questionPackageService.getQuestionPackages();
        res.status(200).json(packages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching packages', error });
    }
});
exports.getPackages = getPackages;
// Update a question package
const updatePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { packageName, questions } = req.body;
        const updatedPackage = yield questionPackageService.updateQuestionPackage(id, packageName, questions);
        if (!updatedPackage) {
            res.status(404).json({ message: 'Package not found' });
            return;
        }
        res.status(200).json(updatedPackage);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating package', error });
    }
});
exports.updatePackage = updatePackage;
// Delete a question package
const deletePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedPackage = yield questionPackageService.deleteQuestionPackage(id);
        if (!deletedPackage) {
            res.status(404).json({ message: 'Package not found' });
            return;
        }
        res.status(200).json({ message: 'Package deleted', deletedPackage });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting package', error });
    }
});
exports.deletePackage = deletePackage;
