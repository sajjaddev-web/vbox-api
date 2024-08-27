import db from "../utils/db";
import { ServiceResult } from "../utils/result";

// Function to toggle like
export const toggleLike = async (
  userId: number,
  musicId: number
): Promise<ServiceResult> => {
  try {
    // Check if the like already exists
    const existingLike = await db.like.findFirst({
      where: {
        AND: [{ userId }, { musicId }],
      },
    });

    if (existingLike) {
      // If the like exists, remove it
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return { status: 200, data: { message: "Like removed successfully" } };
    } else {
      // If the like does not exist, create a new like
      await db.like.create({
        data: {
          userId,
          musicId,
        },
      });
      return { status: 201, data: { message: "Like added successfully" } };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { status: 500, data: { message: "Service error" } };
  }
};
// Function to check if a user has liked a specific music
export const hasLiked = async (
  userId: number,
  musicId: number
): Promise<ServiceResult> => {
  try {
    const like = await db.like.findFirst({
      where: {
        AND: [{ userId }, { musicId }],
      },
    });

    return { status: 200, data: { liked: !!like } };
  } catch (error) {
    console.error("Error checking like status:", error);
    return { status: 500, data: { message: "Service error" } };
  }
};
