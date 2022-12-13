import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_API_KEY!,
      clientSecret: process.env.TWITTER_API_KEY_SECRET!,
      version: "1.0a",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  //   debug: process.env.NODE_ENV === "development",
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account != null) {
        if (account.accessToken) {
          token.accessToken = account.access_token;
        }

        if (account.refreshToken) {
          token.refreshToken = account.refresh_token;
        }
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
});
