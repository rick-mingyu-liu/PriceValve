"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const apiRoutes_1 = __importDefault(require("./routes/apiRoutes"));
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Debug: Check if environment variables are loaded
console.log('🔧 Environment variables loaded:');
console.log('   PORT:', process.env.PORT);
console.log('   STEAM_API_KEY:', process.env.STEAM_API_KEY ? '✅ Found' : '❌ Not found');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Found' : '❌ Not found');
console.log('');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Connect to MongoDB
(0, database_1.connectDatabase)().catch(console.error);
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const userAgent = req.get('User-Agent') || 'Unknown';
    console.log(`📊 ${timestamp} - ${method} ${url} - ${userAgent}`);
    next();
});
// Main API routes - that's it!
app.use('/api', apiRoutes_1.default);
// Error handler
app.use(errorHandler_1.errorHandler);
// 404 fallback route - use correct Express wildcard syntax
app.use((req, res) => {
    console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: 'Check the API documentation for available endpoints',
        path: req.originalUrl,
        method: req.method
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 PriceValve API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📈 Main endpoint: http://localhost:${PORT}/api/fetch`);
    console.log(`🗑️  Clear cache: http://localhost:${PORT}/api/cache`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
    console.log('📋 Available endpoints:');
    console.log('   POST /api/fetch - Fetch game data (single, multiple, trending, search)');
    console.log('   GET  /api/health - Health check and system status');
    console.log('   DELETE /api/cache - Clear cache');
    console.log('');
    if (!process.env.MONGODB_URI) {
        console.warn('⚠️  MONGODB_URI not found - using default local MongoDB');
    }
});
exports.default = app;
//# sourceMappingURL=server.js.map