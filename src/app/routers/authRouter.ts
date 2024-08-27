import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { createUserService, loginUserService } from "../services/authService";
const auth = new Hono();

auth.post(
  "/register",
  zValidator(
    "json",
    z.object({
      username: z.string().regex(/^[a-zA-Z0-9]+$/),
      email: z.string().email(),
      password: z
        .string()
        .regex(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
    })
  ),
  async (c) => {
    const validated = c.req.valid("json");
    try {
      const { status, data } = await createUserService(validated);
      return c.json(data, { status });
    } catch (error) {
      return c.json({ message: "Internal Error" }, { status: 500 });
    }
  }
);

auth.post(
  "/login",
  zValidator(
    "json",
    z.object({
      info: z.string(),
      password: z.string(),
    })
  ),
  async (c) => {
    const validated = c.req.valid("json");
    try {
      const { status, data } = await loginUserService(validated);
      return c.json(data, { status });
    } catch (error) {
      return c.json({ message: "Internal Error" }, { status: 500 });
    }
  }
);

export default auth;
