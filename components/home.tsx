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
import { TwitterShareButton } from "react-share";
import { FaTwitter } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession({ required: true });
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
      // Keep console log on prod
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
        setTweets(tweets.response);
      } else {
        setError(tweets);
      }
      setLoading(false);
    };
    f();
  };

  const length = Array.from(Array(named?.nickname.length ?? 0).keys());
  const top = Array.from(length)
    .map(() => "人")
    .join("");
  const bottom = Array.from(length)
    .map(() => "Y^")
    .join("");

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

            <VStack display={"flex"}>
              {named && (
                <VStack>
                  <Text fontWeight={"bold"} fontSize={"2xl"}>
                    {top}
                  </Text>
                  <Text fontWeight={"bold"} fontSize={"2xl"}>
                    {`＞　${named.nickname}　＜`}
                  </Text>
                  <Text fontWeight={"bold"} fontSize={"2xl"}>
                    {bottom}
                  </Text>

                  <HStack>
                    <TwitterShareButton
                      title={`私のあだ名は「${named.nickname}」です。あなたのあだ名は？ #kiminoadanaha`}
                      url={"https://kiminoadanaha.vercel.app/"}
                      style={{
                        background: "#359BF0",
                        borderRadius: "50%",
                        padding: "0.5rem",
                      }}
                    >
                      <Box p={0.8}>
                        <FaTwitter color={"white"} />
                      </Box>
                    </TwitterShareButton>
                    <Text>でシェアする</Text>
                  </HStack>
                </VStack>
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
