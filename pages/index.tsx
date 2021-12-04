import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import Login from "../components/login";
import Loading from "../modules/loading/loading";

export default function Index() {
    const { user, error, isLoading } = useUser();
    const router = useRouter();

    if (isLoading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;
    if (user) {
        router.push("/dashboard");
        return <Loading />;
    }

    return <Login />;
}
