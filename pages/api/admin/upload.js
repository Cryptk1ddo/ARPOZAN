// API endpoint for handling image uploads
// POST /api/admin/upload - Upload and manage product images
import { IncomingForm } from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { requireAdmin } from '../../../lib/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Allowed image types and size limits
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/products');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check admin authentication
    const user = await requireAdmin(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await ensureUploadDir();

    const form = new IncomingForm({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE,
      maxFields: 10,
      maxFieldsSize: 2 * 1024 * 1024, // 2MB for form fields
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const uploadedFiles = [];
    const errors = [];

    // Process uploaded files
    for (const [fieldName, file] of Object.entries(files)) {
      try {
        const fileArray = Array.isArray(file) ? file : [file];
        
        for (const singleFile of fileArray) {
          // Validate file type
          if (!ALLOWED_TYPES.includes(singleFile.mimetype)) {
            errors.push(`Invalid file type: ${singleFile.originalFilename}. Allowed: JPEG, PNG, WebP`);
            continue;
          }

          // Validate file size
          if (singleFile.size > MAX_FILE_SIZE) {
            errors.push(`File too large: ${singleFile.originalFilename}. Max size: 5MB`);
            continue;
          }

          // Generate unique filename
          const ext = path.extname(singleFile.originalFilename || '');
          const filename = `${uuidv4()}${ext}`;
          const newPath = path.join(UPLOAD_DIR, filename);

          // Move file to final location
          await fs.rename(singleFile.filepath, newPath);

          // Generate public URL
          const publicUrl = `/uploads/products/${filename}`;

          uploadedFiles.push({
            fieldName,
            originalName: singleFile.originalFilename,
            filename,
            url: publicUrl,
            size: singleFile.size,
            mimetype: singleFile.mimetype,
          });
        }
      } catch (error) {
        console.error('Error processing file:', error);
        errors.push(`Failed to process file: ${file.originalFilename || 'unknown'}`);
      }
    }

    // Return results
    res.status(200).json({
      success: true,
      message: `Uploaded ${uploadedFiles.length} file(s)`,
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 5MB.' 
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        error: 'Too many files or unexpected file field.' 
      });
    }

    res.status(500).json({ 
      error: 'Upload failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Helper function to delete uploaded files
export async function deleteUploadedFile(filename) {
  try {
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}