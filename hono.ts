import { Hono } from "hono/hono.ts";
import { Session, User } from "npm:lucia";

const hono = () =>
  new Hono<{ Variables: { session?: Session | null; user?: User | null } }>();

export { hono };
