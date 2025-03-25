import crypto from "crypto";
import bcrypt from "bcryptjs";

const OTP_TTL_MINUTES = 10;

export function generateOtp() {
  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  return { code, expiresAt };
}

export async function hashOtp(code) {
  return bcrypt.hash(code, 10);
}

export async function compareOtp(code, hash) {
  return bcrypt.compare(code, hash);
}

// In place of a real email/SMS provider, the code is logged so it can be
// used during local development and demos.
export function deliverOtp(user, code) {
  console.log(`[2FA] verification code for ${user.email}: ${code}`);
}
