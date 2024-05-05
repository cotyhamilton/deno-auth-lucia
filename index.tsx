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
      <body
        class="container"
        style="height: 100vh; display: flex; justify-content: center; align-items: center;"
      >
        {c.var.user
          ? (
            <article style="text-align: center; width: 100%; max-width: 600px;">
              <div class="avatar" style="border: 1px solid white; border-radius: 50%; height: 100px; overflow: hidden; width: 100px;">
                <img src={c.var.user.avatarUrl} alt="Avatar" style="height: 100%; object-fit: cover; width: 100%;" />
              </div>
              <h1>hello {c.var.user.name} 👋</h1>
              <p style="text-align: start;">
                <strong>id -- </strong>{c.var.user.githubId}
                <br />
                <strong>username -- </strong>{c.var.user.username}
              </p>
              <form action="/logout" method="post" style="margin: 0;">
                <button class="contrast">sign out</button>
              </form>
            </article>
          )
          : (
            <article style="text-align: center; width: 100%; max-width: 600px;">
              <h1>sign in</h1>
              <a
                href="/login/github"
                role="button"
                class="contrast"
                style="width: 100%; display: block;"
              >
                sign in with github
              </a>
            </article>
          )}
      </body>
    </html>,
  );
});

export default app;
