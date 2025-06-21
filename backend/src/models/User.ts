import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  steamId: string;
  displayName: string;
  profileUrl: string;
  avatar: string;
  avatarMedium: string;
  avatarFull: string;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  steamId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  displayName: {
    type: String,
    required: true
  },
  profileUrl: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  avatarMedium: {
    type: String,
    required: true
  },
  avatarFull: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastLogin on save
userSchema.pre('save', function(next) {
  this.lastLogin = new Date();
  next();
});

export const User = mongoose.model<IUser>('User', userSchema); 