"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const interviewRoutes_1 = __importDefault(require("./routes/interviewRoutes"));
const question_1 = __importDefault(require("./routes/question"));
const user_1 = __importDefault(require("./routes/user"));
const questionTimeRoutes_1 = __importDefault(require("./routes/questionTimeRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware"); // Middleware importu
const media_1 = __importDefault(require("./routes/media"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['https://remoteadmin.vercel.app', 'https://remoteuser.vercel.app', 'https://remotenewadmin.vercel.app'], // Frontend'in çalıştığı portları burada belirtin
    credentials: true, // Eğer frontend'den cookie gönderiyorsanız bunu kullanın
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Auth, Interview ve QuestionPackage rotalarını ekleyin
app.use('/api/auth', auth_1.default);
app.use('/api/interviews', interviewRoutes_1.default);
app.use('/api/question-package', authMiddleware_1.authMiddleware, question_1.default);
app.use('/api/users', user_1.default);
app.use('/api/upload', media_1.default);
app.use('/api', questionTimeRoutes_1.default);
app.options('*', (0, cors_1.default)()); // OPTIONS isteği için izin ver
// Basit bir test rotası
app.get('/', (_req, res) => {
    res.send('API is running...');
});
// Sunucu portunu dinleme
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
