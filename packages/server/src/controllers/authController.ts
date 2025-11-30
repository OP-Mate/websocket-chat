import { Request, Response } from "express";
import { hashPassword } from "src/utils/password";
import { addUserToDB, findUser } from "../db/queries";
import { verifyPassword } from "src/utils/password";
import { generateToken } from "src/utils/jwt";
import { AuthRequest } from "src/types";

interface IRegister {
  username: string;
  password: string;
}

export const register = async (
  req: Request<unknown, unknown, IRegister>,
  res: Response
) => {
  const rawUsername = req.body?.username;
  const rawPassword = req.body?.password;

  const username = rawUsername.trim();
  const password = rawPassword;

  if (typeof rawUsername !== "string" || typeof rawPassword !== "string") {
    return res.status(400).json({ message: "Invalid request" });
  }

  if (password.trim() === "") {
    return res.status(400).json({ message: "Password cannot be blank" });
  }

  try {
    const hashedPassword = await hashPassword(password);

    const userResult = addUserToDB(username, hashedPassword);

    if (!userResult.success) {
      const status = userResult.error === "Username already exists" ? 409 : 400;
      return res
        .status(status)
        .json({ message: "User creation failed", error: userResult.error });
    }

    const token = await generateToken({
      id: userResult.data.id,
      username: userResult.data.username,
    });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // consider short maxAge for access token and use a refresh token cookie
    });

    return res
      .status(201)
      .json({ code: "user_created", username: userResult.data.username });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body ?? {};

  if (typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({ code: "username_required" });
  }

  const userResult = findUser(username);

  if (!userResult.success || !userResult.data) {
    return res.status(401).json({ code: "incorrect_username_or_password" });
  }

  try {
    const isMatched = await verifyPassword(
      password,
      userResult.data.password_hash
    );

    if (!isMatched) {
      return res.status(401).json({ code: "incorrect_username_or_password" });
    }

    const token = await generateToken({
      id: userResult.data.id,
      username: userResult.data.username,
    });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(201).json({ code: "user_logged_in", username: username });
  } catch (error) {
    console.error("Error verifying password", error);
    return res.status(500).json({ code: "internal_server_error" });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({
    user: {
      id: req.user?.id,
      username: req.user?.username,
    },
  });
};
