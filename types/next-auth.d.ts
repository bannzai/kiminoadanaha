import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      userID?: string;
      accessToken?: string;
      accessTokenSecret?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Record<string, unknown>, DefaultJWT {
    userID?: string;
    accessToken?: string;
    accessTokenSecret?: string;
  }
}
