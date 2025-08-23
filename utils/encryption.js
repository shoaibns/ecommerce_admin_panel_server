import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY;
const ivLength = 16; // AES block size

export function encrypt(text) {
    
  const iv = crypto.randomBytes(ivLength);

  console.log("secret key___________", secretKey);
  
  const key = Buffer.from(secretKey, 'base64');

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Return Base64 for both IV and encrypted data
  return iv.toString('base64') + ':' + encrypted.toString('base64');
}

export function decrypt(encryptedText) {
  const [ivBase64, dataBase64] = encryptedText.split(':');
  const iv = Buffer.from(ivBase64, 'base64');
  
  const encrypted = Buffer.from(dataBase64, 'base64');

  const key = Buffer.from(secretKey, 'base64');
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted);
  
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

export function hashEmail(email) {
  return crypto.createHash('sha256').update(email).digest('hex');
}
