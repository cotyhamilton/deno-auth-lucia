import { GitHub } from "npm:arctic";

export const github = new GitHub(
  Deno.env.get("GITHUB_CLIENT_ID") ?? "",
  Deno.env.get("GITHUB_CLIENT_SECRET") ?? "",
);
