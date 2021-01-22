export class User {
  id: object;
  email: string;
  password: string;
  role: string[];
  apiKeys: string[];

  profile: {
    lastName: string;
    firstName: string;
    gender: string;
    location: string;
    picture: string;
  };
  gravatar: (size: number) => string;
}
