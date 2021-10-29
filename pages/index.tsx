// pages/index.js
import { useUser } from '@auth0/nextjs-auth0';
import Login from '../components/login';
import Loading from '../modules/loading/loading';
import redirect from 'nextjs-redirect'

export default function Index() {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <Loading />
    if (error) return <div>{error.message}</div>;

    if (user) return redirect('/dashboard');

    return <Login />
}