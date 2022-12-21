import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function generatePrompt({ tweets }: { tweets: string[] }) {
  let embed = "";
  for (const tweet of tweets) {
    embed += `「${tweet}」`;
  }

  return `${embed}

この${tweets.length}個の発言をする人にぴったりなあだ名は、「`;
}

export type NameResponse =
  | {
      result: "success";
      nickname: string;
      prompt: string;
      rawCompletion: string;
      fullText: string;
    }
  | {
      result: "failure";
      message: string;
      extension?: {
        body: any;
        prompt: string;
        rawCompletion?: string;
      };
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NameResponse>
) {
  if (req.method !== "POST") {
    res.status(405).json({
      result: "failure",
      message: "Only POST request allowed",
    });
    return;
  }

  const prompt = generatePrompt(req.body);
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
    max_tokens: 25,
    best_of: 1,
    suffix: "点です！",
  });
  const rawCompletion = completion.data.choices[0].text;
  // NOTE: Return `GOOD NICKNAME 」` ...
  const nickname = rawCompletion?.split("」")[0].trimEnd();

  if (rawCompletion == null || nickname == null) {
    res.status(200).json({
      result: "failure",
      message: "あだ名が検出できませんでした",
      extension: {
        body: req.body,
        prompt,
        rawCompletion,
      },
    });
  } else {
    res.status(200).json({
      result: "success",
      nickname,
      prompt,
      rawCompletion,
      fullText: prompt + rawCompletion,
    });
  }
}
