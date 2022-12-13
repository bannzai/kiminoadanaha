import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0", // opt-in to Twitter OAuth 2.0
    }),
  ],
  secret: process.env.TWITTER_API_KEY_SECRET!,
});
