import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import auth from "./app/routers/authRouter";
import music from "./app/routers/musicRouter";
import comment from "./app/routers/commentRouter";
import like from "./app/routers/likeRouter";

//create server
const app = new Hono();

// add routes
app.route("/auth", auth);
app.route("/music", music);
app.route("/comment", comment);
app.route("like", like);

//setting port
const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

//run app
serve({
  fetch: app.fetch,
  port,
});
