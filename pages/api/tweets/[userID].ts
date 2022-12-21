import { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi, TwitterApiTokens } from "twitter-api-v2";

export type TweetResponse =
  | {
      result: "success";
      response: string[];
    }
  | {
      result: "failure";
      message: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TweetResponse>
) {
  if (req.method !== "GET") {
    res.status(405).json({
      result: "failure",
      message: "Only GET request allowed",
    });
    return;
  }

  const { userID } = req.query;

  const tokens: TwitterApiTokens = {
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_KEY_SECRET!,
    accessToken: req.headers["x-twitter-access-token"] as string,
    accessSecret: req.headers["x-twitter-access-token-secret"] as string,
  };

  const twitterClient = new TwitterApi(tokens);
  const readOnlyClient = twitterClient.readOnly;
  try {
    const response = await readOnlyClient.v1.userTimeline(userID as string, {
      count: 20,
      exclude_replies: true,
      include_rts: false,
      trim_user: true,
    });

    res.status(200).json({
      result: "success",
      response: response.tweets.map((tweet) => tweet.full_text ?? tweet.text),
    });
  } catch (error) {
    res.status(200).json({
      result: "failure",
      message: (error as Error).toString(),
    });
    return;
  }
}
