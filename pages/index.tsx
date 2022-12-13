import { useSession } from "next-auth/react";
import router, { useRouter } from "next/router";
import { Spinner } from "@chakra-ui/react";
import Home from "../components/home";
import Login from "../components/login";

export default function Root() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return <Spinner />;
  }

  if (!session) {
    return <Login />;
  }
  return <Home />;
}
