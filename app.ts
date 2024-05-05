import "@std/dotenv/load";
import { logger } from "hono/middleware.ts";
import { auth } from "./auth.ts";
import { hono } from "./hono.ts";
import homepage from "./index.tsx";
import login from "./login.ts";
import logout from "./logout.ts";

const app = hono();

// logging middleware
app.use("*", logger());
// authentication middleware
app.use("*", auth());
// homepage
app.route("/", homepage);
// login
app.route("/login", login);
// logout
app.route("/logout", logout);

Deno.serve(app.fetch);
