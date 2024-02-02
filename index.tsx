/** @jsx jsx */
/** @jsxFrag Fragment */

import { jsx } from "hono/middleware.ts";
import { hono } from "./hono.ts";

const app = hono();

app.get("/", (c) => {
  return c.html(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>hello 👋</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
        >
        </link>
      </head>
      <body style="height: 100vh;display: flex;justify-content: center; align-items: center;">
        {c.var.user
          ? (
            <div style="text-align: center;">
              <h1>hello {c.var.user.username} 👋</h1>
              <form action="/logout" method="post" style="margin: 0;">
                <button class="contrast">sign out</button>
              </form>
            </div>
          )
          : (
            <div style="text-align: center;">
              <h1>sign in</h1>
              <a href="/login/github" role="button" class="contrast">
                sign in with github
              </a>
            </div>
          )}
      </body>
    </html>,
  );
});

export default app;
