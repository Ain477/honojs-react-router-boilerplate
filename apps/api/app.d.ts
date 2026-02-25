import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import type { TAuth } from "@/lib/auth";


declare global {
    type TApp = {
        Variables: {
            user: TAuth["$Infer"]["Session"]["user"] | null;
            session: TAuth["$Infer"]["Session"]["session"] | null;
        };
    };
}