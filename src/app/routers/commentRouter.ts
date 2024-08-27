import { Hono } from "hono";
import isLogged from "../middlewares/authMiddleware ";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { AddComment, getAllComments } from "../services/commentService";

const comment = new Hono();

comment.post(
  "/:musicId",
  isLogged,
  zValidator(
    "json",
    z.object({
      text: z.string(),
    })
  ),
  async (c) => {
    try {
      const musicId = Number(c.req.param("musicId"));
      const validated = c.req.valid("json");
      const user = c.get("user"); // Get the user from the context
      const { status, data } = await AddComment(validated, user.id, musicId);
      return c.json({ data }, { status });
    } catch (error) {
      return c.json({ message: "Internal Error" }, { status: 500 });
    }
  }
);

comment.get("/:musicId", async (c) => {
  try {
    const musicId = Number(c.req.param("musicId"));
    const { status, data } = await getAllComments(musicId);
    return c.json({ data }, { status });
  } catch (error) {
    return c.json({ message: "Internal Error" }, { status: 500 });
  }
});
export default comment;
