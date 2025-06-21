import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  // This middleware doesn't block the request, just adds user info if available
  next();
};

export const getUser = (req: Request) => {
  return req.isAuthenticated() ? req.user : null;
}; 