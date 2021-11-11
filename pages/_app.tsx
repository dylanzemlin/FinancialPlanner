import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0';

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        if(document?.body != undefined) {
            let theme = localStorage.getItem('1411-theme');
            document.body.dataset.theme = theme ?? 'dark';
        }
    });

    return (
        <UserProvider>
            <Component { ...pageProps } />
        </UserProvider>
    )
}
export default MyApp
