export type AuthCodeError =
  | "unauthenticated"
  | "validation_failed"
  | "incorrect_username_or_password"
  | "username_taken";

export type DBCodeError =
  | "username_taken"
  | "failed_to_create_user"
  | "failed_to_retrieve_users"
  | "failed_to_save_message"
  | "failed_to_retrieve_messages"
  | "failed_to_create_room"
  | "failed_to_find_user"
  | "failed_to_add_user_to_room"
  | "failed_to_find_room"
  | "failed_to_initialize_websocket";

export type WSCodeError = "invalid_room" | "invalid_message";

export interface AuthResponse {
  code: AuthCodeError;
}

export type ApiCodeError =
  | AuthCodeError
  | DBCodeError
  | WSCodeError
  | "timeout";
