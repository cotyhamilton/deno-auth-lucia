import { setCookie } from "hono/helper.ts";
import { hono } from "./hono.ts";
import { lucia } from "./lucia.ts";

const app = hono();

app.post("/", async (c) => {
  if (!c.get("session")) {
    return c.status(401);
  }
  await lucia.invalidateSession(c.var.session?.id ?? "");
  const sessionCookie = lucia.createBlankSessionCookie();
  setCookie(c, sessionCookie.name, sessionCookie.value, {
    path: ".",
    ...sessionCookie.attributes,
    sameSite: "Lax",
  });
  return c.redirect("/", 302);
});

export default app;
