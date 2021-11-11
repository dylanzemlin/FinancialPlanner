import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        if(document?.body != undefined) {
            let theme = localStorage.getItem('1411-theme');
            document.body.dataset.theme = theme ?? 'dark';
        }
    });

    return (
        <Component { ...pageProps } />
    )
}
export default MyApp
