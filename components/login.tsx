import { signIn } from "next-auth/react";
import { Button, Center, Container, Text } from "@chakra-ui/react";

export default function Login() {
  return (
    <Container maxWidth={"300px"}>
      <Center h="100vh">
        <Button w={"full"} background={"#359BF0"} onClick={() => signIn()}>
          <Text color={"white"}>Continue with Twitter</Text>
        </Button>
      </Center>
    </Container>
  );
}
