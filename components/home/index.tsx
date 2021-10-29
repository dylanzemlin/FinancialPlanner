// pages/index.js
import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import Container from '../../modules/container';
import Styles from './home.module.scss';

const Home: NextPage<{
    profile: UserProfile
}> = (props) => {
    const user = useUser();

    return (
        <Container class={Styles.login}>
            <h1> Hello, { props.profile.sub ?? '' } </h1>
        </Container>
    )
}
export default Home;