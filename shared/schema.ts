import { z } from "zod";

const leftType = z.literal("left");
const messageType = z.literal("message");
const joinType = z.literal("join");
const deleteType = z.literal("delete");

const BroadcastSchema = z.object({
  type: z.union([leftType, joinType, messageType, deleteType]),
  timestamp: z.number().default(() => Date.now()),
});

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const BroadcastMsgSchema = BroadcastSchema.extend({
  name: z.string(),
  message: z.string(),
});

const BroadcastJoinSchema = BroadcastSchema.extend({
  users: z.array(UserSchema),
});

const BroadcastCreateUserSchema = BroadcastSchema.extend({
  name: z.string(),
});

const BroadcastDeleteUserSchema = BroadcastSchema.extend({
  id: z.string().uuid(),
});

type BroadcastMsgSchemaType = z.infer<typeof BroadcastMsgSchema>;

type BroadcastJoinSchemaType = z.infer<typeof BroadcastJoinSchema>;

type UserSchemaType = z.infer<typeof UserSchema>;

type BroadcastCreateUserSchemaType = z.infer<typeof BroadcastCreateUserSchema>;

type BroadcastDeleteUserSchemaType = z.infer<typeof BroadcastDeleteUserSchema>;

export {
  UserSchema,
  BroadcastSchema,
  BroadcastMsgSchema,
  BroadcastJoinSchema,
  BroadcastCreateUserSchema,
  BroadcastDeleteUserSchema,
  type BroadcastMsgSchemaType,
  type BroadcastJoinSchemaType,
  type UserSchemaType,
  type BroadcastCreateUserSchemaType,
  type BroadcastDeleteUserSchemaType,
};
