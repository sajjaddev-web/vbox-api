import { Hono } from "hono";
import isLogged from "../middlewares/authMiddleware ";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  addMusic,
  getAllMyMusic,
  getTopLikedMusics,
} from "../services/musicService";

const music = new Hono();

music.post(
  "",
  isLogged,
  zValidator(
    "json",
    z.object({
      title: z.string(),
      slug: z.string(),
      type: z.string(),
      url: z.string().url("Must be a valid URL"),
      text: z.string().optional(),
      singer: z.string(),
      banner: z.string().optional(),
    })
  ),
  async (c) => {
    const validated = c.req.valid("json");
    const user = c.get("user"); // Get the user from the context
    try {
      const { status, data } = await addMusic(validated, user.id);
      return c.json({ data }, { status });
    } catch (error) {
      return c.json({ message: "Internal error" }, { status: 500 });
    }
  }
);

music.get("", isLogged, async (c) => {
  try {
    const user = c.get("user"); // Get the user from the context
    const { status, data } = await getAllMyMusic(user.id);
    return c.json({ data }, { status });
  } catch (error: any) {
    console.log(error);

    return c.json({ message: "Internal error" }, { status: 500 });
  }
});

music.get("topLike", async (c) => {
  try {
    const { status, data } = await getTopLikedMusics();
    return c.json({ data }, { status });
  } catch (error: any) {
    console.log(error.message);
    return c.json({ error: "Internal error" }, { status: 500 });
  }
});

export default music;
