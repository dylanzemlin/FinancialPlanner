// pages/index.js
import { useUser } from '@auth0/nextjs-auth0';
import Home from '../components/home';
import Login from '../components/login';
import Loading from '../modules/loading/loading';

export default function Index() {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <Loading />
    if (error) return <div>{error.message}</div>;

    if (user) return <Home profile={user}/>

    return <Login />
}