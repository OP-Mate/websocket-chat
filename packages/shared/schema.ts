import { z } from "zod";

const UserSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => globalThis.crypto.randomUUID()),
  username: z.string(),
});

// Define each variant
const AllUserSchema = z.object({
  type: z.literal("all_users"),
  users: z.array(UserSchema),
  userId: z.string().uuid(),
});

const NewUserSchema = z.object({
  type: z.literal("new_user"),
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
});

const JoinFailedSchema = z.object({
  type: z.literal("join_failed"),
  error: z.string(),
});

const DeleteSchema = z.object({
  type: z.literal("delete"),
  id: z.string().uuid(),
});

const RoomSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// Create the discriminated union
const ChatEventSchema = z.discriminatedUnion("type", [
  AllUserSchema,
  MessageSchema,
  DeleteSchema,
  NewUserSchema,
  JoinFailedSchema,
  MessageInputSchema,
]);

type ChatEventSchemaType = z.infer<typeof ChatEventSchema>;

type UserSchemaType = z.infer<typeof UserSchema>;

type MessageSchemaType = z.infer<typeof MessageSchema>;
type MessageInputSchemaType = z.infer<typeof MessageInputSchema>;

type NewUserSchemaType = z.infer<typeof NewUserSchema>;

type RoomSchemaType = z.infer<typeof RoomSchema>;

export { ChatEventSchema, UserSchema, NewUserSchema, MessageInputSchema };

export type {
  ChatEventSchemaType,
  UserSchemaType,
  MessageSchemaType,
  NewUserSchemaType,
  MessageInputSchemaType,
  RoomSchemaType,
};
