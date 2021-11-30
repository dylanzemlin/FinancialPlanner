import { NextPage } from "next";
import Container from "../../modules/container";
import Styles from "./login.module.scss";
import Image from 'next/image';

const Login: NextPage = () => {
	return (
		<Container className={Styles.login}>
			<div className={Styles.content}>
                <h1> One Planner, One Student </h1>
                <p> 
                    TODO: Fill in some catch phrase thing to attract attention of coming users
                </p>

                <a href="/api/auth/login">Login</a>
            </div>

            {/* Consider adding a image or something here? */}
		</Container>
	);
};
export default Login;
