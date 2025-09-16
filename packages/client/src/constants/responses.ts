import type { AuthCode } from "chat-shared";

export const serverResponses: Record<AuthCode, string> = {
  incorrect_username_or_password: "Incorrect username or password",
};
