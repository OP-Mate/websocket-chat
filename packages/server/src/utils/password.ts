import bcrypt from "bcrypt";

const BCRYPT_SALT_ROUNDS = 12;

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
};

export const verifyPassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);
