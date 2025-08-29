import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const hashPassword = (password) => bcrypt.hash(password, 10);

const comparePasswords = (plain, hash) => bcrypt.compare(plain, hash);

const generateToken = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "12h" });
  // jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "10s" });

export {
  hashPassword,
  comparePasswords,
  generateToken
}