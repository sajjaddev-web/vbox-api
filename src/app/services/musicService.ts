import { IAddMusicForm } from "../forms/musicForm";
import db from "../utils/db";
import { ServiceResult } from "../utils/result";

export const addMusic = async (
  form: IAddMusicForm,
  userId: number
): Promise<ServiceResult> => {
  try {
    const music = await db.music.create({
      data: {
        singer: form.singer,
        title: form.title,
        text: form.text,
        type: form.type,
        slug: form.slug,
        url: form.url,
        banner: form.banner,
        userId,
      },
    });
    return {
      status: 201,
      data: { music, message: "Music added successfully" },
    };
  } catch (error: any) {
    console.log(error.message);

    return { status: 500, data: { message: "Error creating music" } };
  }
};

export const getAllMyMusic = async (userId: number): Promise<ServiceResult> => {
  try {
    const musics = await db.music.findMany({ where: { id: userId } });
    return { status: 200, data: musics };
  } catch (error: any) {
    console.log(error.message);
    return { status: 500, data: { message: "Internal error" } };
  }
};

export const getTopLikedMusics = async (): Promise<ServiceResult> => {
  try {
    const topMusics = await db.music.findMany({
      include: {
        likes: true,
      },
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      take: 12,
    });
    return { data: topMusics, status: 200 };
  } catch (error: any) {
    console.log(error.message);

    return { data: { error: "Service Error" }, status: 500 };
  }
};
