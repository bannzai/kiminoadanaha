import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import {
  Button,
  Textarea,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useState } from "react";
import { NameResponse } from "./api/name";

export default function Home() {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setTweet(inputValue);
  };

  const handleOnClick = () => {
    const f = async () => {
      setLoading(true);
      const response = await fetch("/api/name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tweet: tweet }),
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
  };
  return (
    <>
      <Text mb="8px">Tweet</Text>
      <Textarea
        value={tweet}
        onChange={handleInputChange}
        placeholder="Here is a sample placeholder"
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
          <Text>Named: {named.nickname}</Text>
          <Text aria-multiline={true}>OpenAI Say: {named.fullText}</Text>
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
