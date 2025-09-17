import type { AuthCode } from "chat-shared";

export const serverResponses: Record<AuthCode, string> = {
  incorrect_username_or_password: "Incorrect username or password",
  unauthenticated: "TBC",
  user_logged_in: "TBC",
  validation_failed: "TBC",
  user_created: "user_created",
};
