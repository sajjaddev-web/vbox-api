import { Context } from "hono";
import { verify } from "hono/jwt";
import db from "../utils/db";

// Define a custom context type
interface CustomContext extends Context {
  user?: {
    id: number;
    username: string;
    email: string;
    isActive: boolean;
  };
}

// Middleware to check if user is logged in and active
const isLogged = async (
  c: CustomContext, // Use the custom context type
  next: () => Promise<void>
) => {
  const authToken = c.req.header("Authorization");

  if (!authToken) {
    return c.json({ error: true, message: "Unauthorized" }, 401);
  }

  try {
    const decoded = await verify(
      authToken,
      process.env.SECRET_KEY || "my-secret"
    );

    if (!decoded || typeof decoded.id !== "number") {
      return c.json({ error: true, message: "Invalid token" }, 400);
    }

    const user = await db.user.findUnique({
      where: { id: decoded.id },
    });

    // Store the user object in the context
    c.set("user", user);
    await next();
  } catch (error) {
    console.error("Middleware error:", error);
    return c.json({ error: true, message: "Internal error" }, 500);
  }
};

export default isLogged;
