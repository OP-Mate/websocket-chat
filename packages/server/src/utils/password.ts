import bcrypt from "bcrypt";
import { env } from "../../env";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, env.BCRYPT_ROUNDS);
};

export const verifyPassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);
