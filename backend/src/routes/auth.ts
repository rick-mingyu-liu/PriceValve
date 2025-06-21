import { Router, Request, Response } from 'express';
import passport from 'passport';

const router = Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// GET /auth/steam - Initiate Steam login
router.get('/steam', passport.authenticate('steam', { 
  failureRedirect: '/auth/failure' 
}));

// GET /auth/steam/return - Handle Steam callback
router.get('/steam/return', 
  passport.authenticate('steam', { 
    failureRedirect: '/auth/failure',
    failureFlash: true 
  }),
  (req: Request, res: Response) => {
    // Successful authentication
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/dashboard?login=success`);
  }
);

// GET /auth/profile - Return current user data
router.get('/profile', isAuthenticated, (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json({
      success: true,
      user: {
        steamId: user.steamId,
        displayName: user.displayName,
        profileUrl: user.profileUrl,
        avatar: user.avatar,
        avatarMedium: user.avatarMedium,
        avatarFull: user.avatarFull,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// GET /auth/logout - Clear session
router.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Failed to logout' });
      return;
    }
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        res.status(500).json({ error: 'Failed to destroy session' });
        return;
      }
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}?logout=success`);
    });
  });
});

// GET /auth/status - Check authentication status
router.get('/status', (req: Request, res: Response) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? {
      steamId: req.user?.steamId,
      displayName: req.user?.displayName,
      avatar: req.user?.avatar
    } : null
  });
});

// GET /auth/test - Test route for debugging
router.get('/test', (req: Request, res: Response) => {
  res.json({
    message: 'Auth routes are working',
    session: req.session ? 'Session exists' : 'No session',
    authenticated: req.isAuthenticated(),
    user: req.user || 'No user'
  });
});

// GET /auth/failure - Handle authentication failure
router.get('/failure', (req: Request, res: Response) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/login?error=auth_failed`);
});

export { router as authRoutes }; 