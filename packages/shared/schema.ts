import { z } from "zod";

const UserSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => globalThis.crypto.randomUUID()),
  name: z.string(),
});

// Define each variant
const JoinSchema = z.object({
  type: z.literal("join"),
  users: z.array(UserSchema),
});

const MessageSchema = z.object({
  type: z.literal("message"),
  name: z.string(),
  message: z.string(),
  timestamp: z.number().default(() => Date.now()),
});

const LeftSchema = z.object({
  type: z.literal("left"),
  id: z.string().uuid(),
});

const DeleteSchema = z.object({
  type: z.literal("delete"),
  id: z.string().uuid(),
});

// Create the discriminated union
const ChatEventSchema = z.discriminatedUnion("type", [
  JoinSchema,
  MessageSchema,
  LeftSchema,
  DeleteSchema,
]);

type ChatEventSchemaType = z.infer<typeof ChatEventSchema>;

type UserSchemaType = z.infer<typeof UserSchema>;

type MessageSchemaType = z.infer<typeof MessageSchema>;

export { ChatEventSchema, UserSchema };

export type { ChatEventSchemaType, UserSchemaType, MessageSchemaType };
