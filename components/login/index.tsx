import { NextPage } from "next";
import Container from "../../modules/container";
import Styles from "./login.module.scss";

const Login: NextPage = () => {
	return (
		<Container className={Styles.login}>
			<h1> Welcome to your financial planner </h1>

			<a href="/api/auth/login">Login</a>
		</Container>
	);
};
export default Login;
