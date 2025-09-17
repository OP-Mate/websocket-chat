export type AuthCode =
  | "unauthenticated"
  | "user_logged_in"
  | "validation_failed"
  | "user_created"
  | "incorrect_username_or_password";

export interface AuthResponse {
  code: AuthCode;
}
