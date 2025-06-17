import { z } from "zod";
declare const BroadcastSchema: z.ZodObject<{
    type: z.ZodUnion<[z.ZodLiteral<"left">, z.ZodLiteral<"join">, z.ZodLiteral<"message">, z.ZodLiteral<"delete">]>;
    timestamp: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "join" | "message" | "left" | "delete";
    timestamp: number;
}, {
    type: "join" | "message" | "left" | "delete";
    timestamp?: number | undefined;
}>;
declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>;
declare const BroadcastMsgSchema: z.ZodObject<{
    type: z.ZodUnion<[z.ZodLiteral<"left">, z.ZodLiteral<"join">, z.ZodLiteral<"message">, z.ZodLiteral<"delete">]>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    name: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "join" | "message" | "left" | "delete";
    message: string;
    timestamp: number;
}, {
    name: string;
    type: "join" | "message" | "left" | "delete";
    message: string;
    timestamp?: number | undefined;
}>;
declare const BroadcastJoinSchema: z.ZodObject<{
    type: z.ZodUnion<[z.ZodLiteral<"left">, z.ZodLiteral<"join">, z.ZodLiteral<"message">, z.ZodLiteral<"delete">]>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    users: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    type: "join" | "message" | "left" | "delete";
    timestamp: number;
    users: {
        name: string;
        id: string;
    }[];
}, {
    type: "join" | "message" | "left" | "delete";
    users: {
        name: string;
        id: string;
    }[];
    timestamp?: number | undefined;
}>;
declare const BroadcastCreateUserSchema: z.ZodObject<{
    type: z.ZodUnion<[z.ZodLiteral<"left">, z.ZodLiteral<"join">, z.ZodLiteral<"message">, z.ZodLiteral<"delete">]>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "join" | "message" | "left" | "delete";
    timestamp: number;
}, {
    name: string;
    type: "join" | "message" | "left" | "delete";
    timestamp?: number | undefined;
}>;
declare const BroadcastDeleteUserSchema: z.ZodObject<{
    type: z.ZodUnion<[z.ZodLiteral<"left">, z.ZodLiteral<"join">, z.ZodLiteral<"message">, z.ZodLiteral<"delete">]>;
    timestamp: z.ZodDefault<z.ZodNumber>;
} & {
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "join" | "message" | "left" | "delete";
    id: string;
    timestamp: number;
}, {
    type: "join" | "message" | "left" | "delete";
    id: string;
    timestamp?: number | undefined;
}>;
type BroadcastMsgSchemaType = z.infer<typeof BroadcastMsgSchema>;
type BroadcastJoinSchemaType = z.infer<typeof BroadcastJoinSchema>;
type UserSchemaType = z.infer<typeof UserSchema>;
type BroadcastCreateUserSchemaType = z.infer<typeof BroadcastCreateUserSchema>;
type BroadcastDeleteUserSchemaType = z.infer<typeof BroadcastDeleteUserSchema>;
export { UserSchema, BroadcastSchema, BroadcastMsgSchema, BroadcastJoinSchema, BroadcastCreateUserSchema, BroadcastDeleteUserSchema, type BroadcastMsgSchemaType, type BroadcastJoinSchemaType, type UserSchemaType, type BroadcastCreateUserSchemaType, type BroadcastDeleteUserSchemaType, };
