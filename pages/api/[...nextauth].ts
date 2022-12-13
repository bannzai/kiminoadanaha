import NextAuth, { AuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

export const authOptions: AuthOptions = {
  //   debug: process.env.NODE_ENV === "development",
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_API_KEY!,
      clientSecret: process.env.TWITTER_API_KEY_SECRET!,
      version: "1.0a",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account != null) {
        if (account.oauth_token) {
          token.accessToken = account.oauth_token as string;
        }
        if (account.oauth_token_secret) {
          token.accessTokenSecret = account.oauth_token_secret as string;
        }
        if (account.userId) {
          token.userID = account.userId;
        }
      }
      if (user?.id) {
        token.userID = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.userID = token.userID;
      session.user.accessToken = token.accessToken;
      session.user.accessTokenSecret = token.accessTokenSecret;
      return session;
    },
  },
};

export default NextAuth(authOptions);
