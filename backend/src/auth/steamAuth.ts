import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import { User, IUser } from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

// Session serialization - store user ID in session
passport.serializeUser((user: Express.User, done) => {
  done(null, user.steamId);
});

// Session deserialization - retrieve user from database
passport.deserializeUser(async (steamId: string, done) => {
  try {
    const user = await User.findOne({ steamId });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Steam Strategy configuration
passport.use(new SteamStrategy({
  returnURL: `${process.env.BACKEND_URL || 'http://localhost:5001'}/auth/steam/return`,
  realm: process.env.BACKEND_URL || 'http://localhost:5001',
  apiKey: process.env.STEAM_API_KEY || ''
}, async (identifier: string, profile: any, done: any) => {
  try {
    // Extract Steam ID from the identifier
    const steamId = profile.id;
    
    // Check if user already exists
    let user = await User.findOne({ steamId });
    
    if (user) {
      // Update existing user's information
      user.displayName = profile.displayName;
      user.profileUrl = profile._json.profileurl;
      user.avatar = profile._json.avatar;
      user.avatarMedium = profile._json.avatarmedium;
      user.avatarFull = profile._json.avatarfull;
      user.lastLogin = new Date();
      
      await user.save();
    } else {
      // Create new user
      user = new User({
        steamId: profile.id,
        displayName: profile.displayName,
        profileUrl: profile._json.profileurl,
        avatar: profile._json.avatar,
        avatarMedium: profile._json.avatarmedium,
        avatarFull: profile._json.avatarfull,
        lastLogin: new Date()
      });
      
      await user.save();
    }
    
    return done(null, user);
  } catch (error) {
    console.error('Steam authentication error:', error);
    return done(error, null);
  }
}));

export default passport; 