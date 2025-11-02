import { z } from "zod";

const UserSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => globalThis.crypto.randomUUID()),
  username: z.string(),
  is_online: z.number(),
});

// Define each variant
const AllUserSchema = z.object({
  type: z.literal("all_users"),
  users: z.array(UserSchema),
  userId: z.string().uuid(),
  username: z.string(),
});

const OnlineUserSchema = z.object({
  type: z.literal("online_user"),
  user: UserSchema,
});

const MessageInputSchema = z.object({
  type: z.literal("message_input"),
  message: z.string(),
  roomId: z.number(),
});

const MessageSchema = z.object({
  id: z.number(),
  type: z.literal("message"),
  message: z.string(),
  created_at: z.number(),
  sender_id: z.string().uuid(),
  roomId: z.number(),
});

const JoinFailedSchema = z.object({
  type: z.literal("join_failed"),
  error: z.string(),
});

const OfflineSchema = z.object({
  type: z.literal("offline_user"),
  user: UserSchema,
});

const RoomSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// Create the discriminated union
const ChatEventSchema = z.discriminatedUnion("type", [
  AllUserSchema,
  MessageSchema,
  OfflineSchema,
  OnlineUserSchema,
  JoinFailedSchema,
  MessageInputSchema,
]);

const AuthSchema = z.object({
  username: z.string({ required_error: "Username is required" }),
  password: z.coerce.string().min(1),
});

type ChatEventSchemaType = z.infer<typeof ChatEventSchema>;

type UserSchemaType = z.infer<typeof UserSchema>;

type MessageSchemaType = z.infer<typeof MessageSchema>;
type MessageInputSchemaType = z.infer<typeof MessageInputSchema>;

type OnlineUserSchemaType = z.infer<typeof OnlineUserSchema>;

type RoomSchemaType = z.infer<typeof RoomSchema>;

type AuthSchemaType = z.infer<typeof AuthSchema>;

type AllUserSchemaType = z.infer<typeof AllUserSchema>;

export {
  ChatEventSchema,
  UserSchema,
  OnlineUserSchema,
  MessageInputSchema,
  AuthSchema,
};

export type {
  ChatEventSchemaType,
  UserSchemaType,
  MessageSchemaType,
  OnlineUserSchemaType,
  MessageInputSchemaType,
  RoomSchemaType,
  AuthSchemaType,
  AllUserSchemaType,
};
