import type { AuthCodeError } from "chat-shared";

export const serverResponses: Record<AuthCodeError, string> = {
  incorrect_username_or_password: "Incorrect username or password",
  unauthenticated: "Unauthenticated",
  validation_failed: "Validation Error",
  username_taken: "Username already taken",
};
