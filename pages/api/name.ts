import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function generatePrompt({ tweet }: { tweet: string }) {
  return `「${tweet}」

この発言をする人のピッタリなニックネームをひとつ決めるなら、「
`;
}

export type Response =
  | {
      result: "success";
      nickname: string;
      rawCompletion: string;
    }
  | {
      result: "failure";
      message: string;
      body: any;
      prompt: string;
      rawCompletion?: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const prompt = generatePrompt(req.body);
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
    temperature: 0.9,
    max_tokens: 100,
  });
  const rawCompletion = completion.data.choices[0].text;
  const nickname = rawCompletion?.split("「")[1];
  if (rawCompletion == null || nickname == null) {
    res.status(200).json({
      result: "failure",
      message: "ニックネームが検出できませんでした",
      body: req.body,
      prompt,
      rawCompletion,
    });
  } else {
    res.status(200).json({
      result: "success",
      nickname,
      rawCompletion,
    });
  }
}
