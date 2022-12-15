import {
  Button,
  Textarea,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Center,
  VStack,
  HStack,
  Box,
  Spacer,
  Image,
  Container,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NameResponse } from "../pages/api/name";
import { TweetResponse } from "../pages/api/tweets/[userID]";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";

export default function Home() {
  const { data: session } = useSession({ required: true });
  console.log({ session });
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

  useEffect(() => {
    if (named?.fullText) {
      console.log(named.fullText);
    }
  }, [named?.fullText]);

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
    <Container maxWidth={"800px"}>
      <Center h={"100vh"}>
        <Box display="flex">
          <VStack>
            <VStack justify={"center"}>
              <HStack justify={"start"} width={"100%"}>
                <Text
                  fontSize={"2xl"}
                  fontWeight={"bold"}
                  justifyItems={"start"}
                >
                  君のあだ名は
                </Text>
                <Spacer />
              </HStack>
              <Box boxSize="sm">
                <Image src="/mensetsu_business_ai.png" alt="AIばあちゃん" />
              </Box>
              <Button
                colorScheme="teal"
                size="md"
                width={"100%"}
                onClick={handleOnClick}
                isLoading={loading}
              >
                直近のツイートから命名スタート
              </Button>
            </VStack>

            <VStack>
              {named && (
                <div>
                  <Text>あだ名は: {named.nickname}</Text>
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
            </VStack>
          </VStack>
        </Box>
      </Center>
    </Container>
  );
}
