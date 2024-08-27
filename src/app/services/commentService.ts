import { IAddComment } from "../forms/commentForm";
import db from "../utils/db";
import { ServiceResult } from "../utils/result";

const checkMusicExists = async (musicId: number): Promise<boolean> => {
  const music = await db.music.findUnique({ where: { id: musicId } });
  return music !== null;
};

export const AddComment = async (
  form: IAddComment,
  userId: number,
  musicId: number
): Promise<ServiceResult> => {
  const musicExists = await checkMusicExists(musicId);

  if (!musicExists) {
    return { status: 404, data: { message: "Music not found" } };
  }
  try {
    await db.comment.create({
      data: {
        text: form.text,
        musicId,
        userId,
      },
    });
    return { status: 201, data: { message: "Comment created successfully" } };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { status: 500, data: { message: "Service error" } };
  }
};

export const getAllComments = async (
  musicId: number
): Promise<ServiceResult> => {
  const musicExists = await checkMusicExists(musicId);

  if (!musicExists) {
    return { status: 404, data: { message: "Music not found" } };
  }
  try {
    const comments = await db.comment.findMany({ where: { musicId: musicId } });
    return { status: 200, data: comments };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { status: 500, data: { error: "Service Error" } };
  }
};
