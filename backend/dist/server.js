"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const steamAuth_1 = __importDefault(require("./auth/steamAuth"));
const steam_1 = require("./routes/steam");
const auth_1 = require("./routes/auth");
const errorHandler_1 = require("./middleware/errorHandler");
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const dataRoutes_1 = __importDefault(require("./routes/dataRoutes"));
const database_1 = require("./config/database");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
(0, database_1.connectDatabase)().catch(console.error);
// Session configuration
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/pricevalve',
        collectionName: 'sessions'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
// Initialize Passport middleware
app.use(steamAuth_1.default.initialize());
app.use(steamAuth_1.default.session());
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Basic health check route at /api/health
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'PriceValve API is running',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});
// API routes
app.use('/api/steam', steam_1.steamRoutes);
app.use('/api', gameRoutes_1.default);
app.use('/api/data', dataRoutes_1.default);
// Authentication routes
app.use('/auth', auth_1.authRoutes);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// 404 handler - use a proper path instead of wildcard
app.use('/', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
app.listen(PORT, () => {
    console.log(`🚀 PriceValve server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🎮 Game analysis: http://localhost:${PORT}/api/analyze/:appId`);
    console.log(`📈 Data fetching: http://localhost:${PORT}/api/data/game/:appId`);
    console.log(`📈 Database stats: http://localhost:${PORT}/api/stats`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/auth/steam`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    // Check for required environment variables
    if (!process.env.STEAM_API_KEY) {
        console.warn('⚠️  STEAM_API_KEY not found - Steam API features may be limited');
    }
    if (!process.env.MONGODB_URI) {
        console.warn('⚠️  MONGODB_URI not found - using default local MongoDB');
    }
    if (!process.env.SESSION_SECRET) {
        console.warn('⚠️  SESSION_SECRET not found - using default secret (not recommended for production)');
    }
});
exports.default = app;
//# sourceMappingURL=server.js.map