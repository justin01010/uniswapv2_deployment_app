// models/User.js
import mongoose from 'mongoose';

const PairSchema = new mongoose.Schema({
  token1: { type: String, required: true },
  token2: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  factoryAddr: { type: String, required: false},
  routerAddr: { type: String, required: false},
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;

