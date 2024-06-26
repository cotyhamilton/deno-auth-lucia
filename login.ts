import { generateState, OAuth2RequestError } from "arctic";
import { getCookie, setCookie } from "hono/helper.ts";
import { DatabaseUser } from "lucia";
import { db } from "./db.ts";
import { dev } from "./environment.ts";
import { github } from "./github.ts";
import { hono } from "./hono.ts";
import { lucia } from "./lucia.ts";

const app = hono();

app.get("/github", async (c) => {
  const state = generateState();
  const url = await github.createAuthorizationURL(state);

  setCookie(c, "github_oauth_state", state, {
    path: "/",
    secure: !dev,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "Lax",
  });

  return c.redirect(url.toString());
});

app.get("/github/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const storedState = getCookie(c, "github_oauth_state");
  if (!code || !state || !storedState || state !== storedState) {
    return c.status(400);
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();
    const existingUser =
      (await db.get<DatabaseUser>(["github_users", githubUser.id])).value;

    if (existingUser) {
      // update user in case details have changed
      await db.atomic()
        .set(["users", existingUser.id], {
          id: existingUser.id,
          github_id: githubUser.id,
          username: githubUser.login,
          name: githubUser.name,
          avatar_url: githubUser.avatar_url,
        })
        .set(["github_users", githubUser.id], {
          id: existingUser.id,
          github_id: githubUser.id,
          username: githubUser.login,
          name: githubUser.name,
          avatar_url: githubUser.avatar_url,
        })
        .commit();
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      setCookie(c, sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes,
        sameSite: "Lax",
      });
    } else {
      const userId = crypto.randomUUID();
      await db.atomic()
        .check({ key: ["users", userId], versionstamp: null })
        .check({ key: ["github_users", githubUser.id], versionstamp: null })
        .set(["users", userId], {
          id: userId,
          github_id: githubUser.id,
          username: githubUser.login,
          name: githubUser.name,
          avatar_url: githubUser.avatar_url,
        })
        .set(["github_users", githubUser.id], {
          id: userId,
          github_id: githubUser.id,
          username: githubUser.login,
          name: githubUser.name,
          avatar_url: githubUser.avatar_url,
        })
        .commit();
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      setCookie(c, sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes,
        sameSite: "Lax",
      });
    }

    return c.redirect("/", 302);
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return c.status(400);
    }
    return c.status(500);
  }
});

export default app;

interface GitHubUser {
  id: string;
  login: string;
  name: string;
  avatar_url: string;
}
