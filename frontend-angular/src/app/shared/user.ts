export class User {
  id: string;
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  role: string[];

  profile: {
    lastName: string;
    firstName: string;
    gender: string;
    location: string;
    picture: string;
  };
}
