import { DenoKVAdapter } from "lucia-auth-adapter-deno-kv";
import { Lucia } from "npm:lucia";
import { db } from "./db.ts";
import { dev } from "./environment.ts";

export const lucia = new Lucia(new DenoKVAdapter(db), {
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      githubId: attributes.github_id,
      username: attributes.username,
    };
  },
  sessionCookie: {
    attributes: {
      secure: !dev,
    },
  },
});

declare module "npm:lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  github_id: string;
  username: string;
}
