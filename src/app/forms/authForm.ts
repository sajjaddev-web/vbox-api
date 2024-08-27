export interface IRegisterForm {
  username: string;
  email: string;
  password: string;
}

export interface ILoginForm {
  info: string;
  password: string;
}

export interface IUpdateUserForm {
  username?: string; // Optional username update
  email?: string; // Optional email update
  password?: string; // Optional password update
  bio?: string; // Optional bio update
  avatar?: string; // Optional avatar URL update
  birthday?: Date; // Optional birthday update
}
