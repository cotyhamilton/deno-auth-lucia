import { getCookie } from "hono/helper.ts";
import { type MiddlewareHandler } from "hono/types.ts";
import { lucia } from "./lucia.ts";

export const auth = (): MiddlewareHandler => {
  return async function auth(c, next) {
    const sessionId = getCookie(c, lucia.sessionCookieName);
    if (!sessionId) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }
    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
      c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
    }
    if (!session) {
      c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize());
    }
    c.set("session", session);
    c.set("user", user);
    return next();
  };
};
