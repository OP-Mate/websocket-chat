export type AuthCode =
  | "unauthenticated"
  | "user_logged_in"
  | "validation_failed"
  | "user_created";

export interface AuthResponse {
  code: AuthCode;
}
