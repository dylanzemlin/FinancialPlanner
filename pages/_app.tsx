import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
import { ToastContainer } from "react-toastify";
import Head from 'next/head';

import "../styles/helpers.css";
import "../styles/globals.css";
import "../styles/scrollbar.css";
import "../styles/tables.css";
import "../styles/charts.css";

import "react-toastify/dist/ReactToastify.css";
import "reactjs-popup/dist/index.css";

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        if (document?.body != undefined) {
            let theme = localStorage.getItem("1411-theme");
            if (theme == undefined) {
                localStorage.setItem("1411-theme", "dark");
            }

            document.body.dataset.theme = theme ?? "dark";
        }
    });

    return (
        <UserProvider>
            <Head>
                {/* <link rel="shortcut icon" href="/images/favicon.ico" /> */}

                <meta name="description" content="A easy to use financial planner for eveeryone" />
                <meta name="keywords" content="financial, planner, ou, university of oklahoma, norman, money, debt" />
                <meta name="author" content="Dylan Zemlin" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <Component {...pageProps} />
            <ToastContainer 
                toastStyle={{ background: "var(--color-bg-secondary)", color: "var(--color-text-primary)" }}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                closeOnClick={true}
                closeButton={false}
            />
        </UserProvider>
    );
}
export default MyApp;
