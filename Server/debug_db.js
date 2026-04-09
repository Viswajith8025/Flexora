
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

const userSchema = new mongoose.Schema({
  email: String,
  role: String,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected");
    const users = await User.find({}, { _id: 1, email: 1, role: 1 }).limit(10);
    console.log("👥 USER LIST (ID mapping):");
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("❌ ERR:", err);
    process.exit(1);
  }
}

checkUsers();
