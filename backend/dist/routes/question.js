"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const question_1 = require("../controllers/question");
const router = express_1.default.Router();
// Define routes
router.post('/create', question_1.createPackage);
router.get('/list', question_1.getPackages);
router.put('/update/:id', question_1.updatePackage); // Update route with dynamic id parameter
router.delete('/delete/:id', question_1.deletePackage); // Delete route with dynamic id parameter
exports.default = router;
