/**
 * Password & Auth Strength Estimator
 * Evaluates character diversity and entropy score.
 */
export const calculateEntropy = (password) => {
  if (!password) return 0;
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 32;
  return Math.round(password.length * Math.log2(pool || 1));
};
