import { signIn } from "next-auth/react";
import { Button, Center, Text } from "@chakra-ui/react";

export default function Login() {
  return (
    <>
      <Button w={"full"} color={"#1DA1F2"} onClick={() => signIn()}>
        <Center>
          <Text>Continue with Twitter</Text>
        </Center>
      </Button>
    </>
  );
}
