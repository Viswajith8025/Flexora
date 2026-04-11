import multer from 'multer';
import { storage } from '../config/cloudinaryConfig.js';

// Init upload with Cloudinary Storage
// This replaces the old local diskStorage which was ephemeral on Render.
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
});

export default upload;
