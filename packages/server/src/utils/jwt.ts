import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { createSecretKey } from "crypto";
import type { UUIDType } from "src/types";

const JWT_SECRET = "your_super_secret_jwt_key_here_asd_asd_asd_er";

const JWT_EXPIRES_IN = "7d";
const secret = JWT_SECRET;

const secretKey = createSecretKey(Buffer.from(secret, "utf-8"));

export interface JwtPayload extends JWTPayload {
  id: UUIDType;
  username: string;
}

export const generateToken = (payload: JwtPayload) => {
  const secretKey = createSecretKey(Buffer.from(secret, "utf-8"));

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("urn:example:issuer")
    .setAudience("urn:example:audience")
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);
};

export const verifyToken = async (jwt: string) => {
  try {
    const { payload } = await jwtVerify(jwt, secretKey, {
      issuer: "urn:example:issuer",
      audience: "urn:example:audience",
    });

    return payload as JwtPayload;
  } catch (error) {
    console.error(error);
    throw new Error("Invalid or expired token");
  }
};
