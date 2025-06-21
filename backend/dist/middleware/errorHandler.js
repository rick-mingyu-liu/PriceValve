"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next // ✅ THIS IS REQUIRED
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(`Error ${statusCode}: ${message}`);
    console.error(err.stack);
    res.status(statusCode).json({
        error: Object.assign({ message, status: statusCode }, (process.env.NODE_ENV === 'development' && { stack: err.stack }))
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map