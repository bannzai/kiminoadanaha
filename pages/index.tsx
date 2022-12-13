import { useSession } from "next-auth/react";
import router, { useRouter } from "next/router";
import { Spinner } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Root() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  useEffect(() => {
    if (!loading) {
      if (session) {
        router.push("/home");
      } else {
        router.push("/login");
      }
    }
  }, [router, loading, session]);

  return <Spinner />;
}
