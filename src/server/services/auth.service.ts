import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import z from "zod";

const emailParser = z.string().email();

async function hashPassword(password: string) {
  const salt = await bcryptjs.genSalt();
  return bcryptjs.hash(password, salt);
}

function checkPassword(plain: string, hash: string) {
  return bcryptjs.compare(plain, hash);
}

function generateResetId() {
  return randomBytes(128 / 2).toString("hex");
}

function createAuthToken(email: string) {
  return jwt.sign(email, process.env.JWT_SECRET);
}

function decodeAuthToken(authToken: string) {
  try {
    const payload = jwt.verify(authToken, process.env.JWT_SECRET);
    return emailParser.parse(payload);
  } catch {
    return null;
  }
}

export default {
  hashPassword,
  checkPassword,
  generateResetId,
  createAuthToken,
  decodeAuthToken
};