import type { AppProps } from "next/app";
import { useEffect } from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
import { ToastContainer } from "react-toastify";

import "../styles/globals.css";
import "../styles/helpers.css";
import "../styles/scrollbar.css";
import "../styles/tables.css";

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
			<Component {...pageProps} />

			<ToastContainer />
		</UserProvider>
	);
}
export default MyApp;
