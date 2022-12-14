import {
  Button,
  Textarea,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NameResponse } from "../pages/api/name";
import { TweetResponse } from "../pages/api/tweets/[userID]";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";

export default function Home() {
  const { data: session } = useSession({ required: true });
  console.log({ session });
  const [tweet, setTweet] = useState("");
  const [named, setNamed] = useState<Extract<
    NameResponse,
    { result: "success" }
  > | null>(null);
  const [error, setError] = useState<Extract<
    NameResponse,
    { result: "failure" }
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [tweets, setTweets] = useState<string[]>([]);

  useEffect(() => {
    if (tweets.length === 0) {
      return;
    }

    const f = async () => {
      setLoading(true);
      const response = await fetch("/api/name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tweets }),
      });

      const named = await (response.json() as Promise<NameResponse>);
      if (named.result === "success") {
        setNamed(named);
      } else {
        setError(named);
      }
      setLoading(false);
    };

    f();
  }, [tweets]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setTweet(inputValue);
  };

  const handleOnClick = () => {
    const f = async () => {
      setLoading(true);
      const response = await fetch(`/api/tweets/${session?.user.userID}`, {
        method: "GET",
        headers: {
          "x-twitter-access-token": session?.user.accessToken!,
          "x-twitter-access-token-secret": session?.user.accessTokenSecret!,
        },
      });
      const tweets = await (response.json() as Promise<TweetResponse>);
      if (tweets.result === "success") {
        console.log({ res: tweets.response ?? "abc" });
        setTweets(tweets.response);
      } else {
        setError(tweets);
      }
      setLoading(false);
    };
    f();
  };

  return (
    <>
      <Text mb="8px">Tweet</Text>
      <Textarea
        value={tweet}
        onChange={handleInputChange}
        placeholder="ツイートを入力しましょう"
        size="sm"
      />
      <Button
        colorScheme="teal"
        size="md"
        onClick={handleOnClick}
        isLoading={loading}
      >
        Button
      </Button>
      {named && (
        <div>
          <Text>ニックネーム: {named.nickname}</Text>
          <Text aria-multiline={true}>Open AI Response: {named.fullText}</Text>
        </div>
      )}
      {error && (
        <div>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>リクエストに失敗しました</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
