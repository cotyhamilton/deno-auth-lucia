import { GitHub } from "npm:arctic";
import { load } from "std/dotenv/mod.ts";

const env = await load({ defaultsPath: null });

export const github = new GitHub(
  env["GITHUB_CLIENT_ID"],
  env["GITHUB_CLIENT_SECRET"],
);
