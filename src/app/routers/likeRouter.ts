import { Hono } from "hono";
import isLogged from "../middlewares/authMiddleware ";
import { toggleLike } from "../services/likeService";

const like = new Hono();

like.post("/:musicId", isLogged, async (c) => {
  try {
    const user = c.get("user"); // Get the user from the context
    const musicId = c.req.param("musicId");
    const { status, data } = await toggleLike(user.id, Number(musicId));
    return c.json({ data }, { status });
  } catch (error) {
    return c.json({ message: "Internal Error" }, { status: 500 });
  }
});

export default like;
