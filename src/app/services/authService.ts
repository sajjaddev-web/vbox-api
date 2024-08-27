import { IRegisterForm, ILoginForm, IUpdateUserForm } from "../forms/authForm";
import db from "../utils/db";
import * as bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import { ServiceResult } from "../utils/result";

// Constants for status codes and messages
const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  USER_EXISTS: 401,
  INVALID_CREDENTIALS: 401,
  SERVER_ERROR: 500,
  NOT_FOUND: 404,
};

// Error messages
const ERROR_MESSAGES = {
  USER_ALREADY_EXISTS: "User already exists",
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  INTERNAL_ERROR: "Internal server error",
  USER_NOT_FOUND: "User not found",
};

// Function to create a new user
export const createUserService = async (
  form: IRegisterForm
): Promise<ServiceResult> => {
  try {
    const userExist = await db.user.findFirst({
      where: { OR: [{ username: form.username }, { email: form.email }] },
    });

    if (userExist) {
      return {
        status: STATUS_CODES.USER_EXISTS,
        data: { message: ERROR_MESSAGES.USER_ALREADY_EXISTS },
      };
    }

    const hashedPassword = await bcrypt.hash(form.password, 10);
    const newUser = await db.user.create({
      data: {
        username: form.username,
        email: form.email,
        password: hashedPassword,
      },
    });

    const { password, id, ...user } = newUser;

    const token = await sign(
      { id, email: user.email, username: user.username },
      process.env.SECRET_KEY || "my-secret"
    );

    return { status: STATUS_CODES.CREATED, data: { user, token } };
  } catch (error: any) {
    console.error(error);
    return {
      status: STATUS_CODES.SERVER_ERROR,
      data: { message: ERROR_MESSAGES.INTERNAL_ERROR },
    };
  }
};

// Function to handle user login
export const loginUserService = async (
  form: ILoginForm
): Promise<ServiceResult> => {
  try {
    const user = await db.user.findFirst({
      where: { OR: [{ username: form.info }, { email: form.info }] },
    });

    if (!user) {
      return {
        status: STATUS_CODES.INVALID_CREDENTIALS,
        data: { message: ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD },
      };
    }

    const isPasswordValid = await bcrypt.compare(form.password, user.password);

    if (!isPasswordValid) {
      return {
        status: STATUS_CODES.INVALID_CREDENTIALS,
        data: { message: ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD },
      };
    }

    const { password, id, ...loggedInUser } = user;

    const token = await sign(
      { id, email: loggedInUser.email, username: loggedInUser.username },
      process.env.SECRET_KEY || "my-secret"
    );

    return {
      status: STATUS_CODES.SUCCESS,
      data: { user: loggedInUser, token },
    };
  } catch (error: any) {
    console.error(error);
    return {
      status: STATUS_CODES.SERVER_ERROR,
      data: { message: ERROR_MESSAGES.INTERNAL_ERROR },
    };
  }
};

// Function to update user data
export const updateUserService = async (
  id: number,
  form: IUpdateUserForm
): Promise<ServiceResult> => {
  try {
    const user = await db.user.findUnique({ where: { id } });

    if (!user) {
      return {
        status: STATUS_CODES.NOT_FOUND,
        data: { message: ERROR_MESSAGES.USER_NOT_FOUND },
      };
    }

    // Prepare updated data, only updating fields that are provided
    const updatedData: any = {};
    if (form.username) updatedData.username = form.username;
    if (form.email) updatedData.email = form.email;
    if (form.password)
      updatedData.password = await bcrypt.hash(form.password, 10);
    if (form.bio) updatedData.bio = form.bio;
    if (form.avatar) updatedData.avatar = form.avatar;
    if (form.birthday) updatedData.birthday = form.birthday;

    const updatedUser = await db.user.update({
      where: { id },
      data: updatedData,
    });

    const { password, ...userData } = updatedUser;

    return { status: STATUS_CODES.SUCCESS, data: { user: userData } };
  } catch (error: any) {
    console.error(error);
    return {
      status: STATUS_CODES.SERVER_ERROR,
      data: { message: ERROR_MESSAGES.INTERNAL_ERROR },
    };
  }
};

// Function to delete user account
export const deleteUserService = async (id: number): Promise<ServiceResult> => {
  try {
    const user = await db.user.findUnique({ where: { id } });

    if (!user) {
      return {
        status: STATUS_CODES.NOT_FOUND,
        data: { message: ERROR_MESSAGES.USER_NOT_FOUND },
      };
    }

    await db.user.delete({ where: { id } });

    return {
      status: STATUS_CODES.SUCCESS,
      data: { message: "User account deleted successfully" },
    };
  } catch (error: any) {
    console.error(error);
    return {
      status: STATUS_CODES.SERVER_ERROR,
      data: { message: ERROR_MESSAGES.INTERNAL_ERROR },
    };
  }
};
