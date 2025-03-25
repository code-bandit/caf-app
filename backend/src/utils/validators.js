export function requireFields(body, fields) {
  const missing = fields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === "";
  });
  if (missing.length) {
    const err = new Error(`Missing required field(s): ${missing.join(", ")}`);
    err.status = 400;
    throw err;
  }
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
