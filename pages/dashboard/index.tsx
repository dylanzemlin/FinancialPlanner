// pages/index.js
import { useUser } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import React from 'react';
import Navbar from '../../components/nav';
import useApi from '../../lib/useApi';
import Container from '../../modules/container';
import NewUser from '../../modules/dashboard/newuser';

const Dashboard: NextPage = (props) => {
    const { user, error, isLoading } = useUser();
    const { response: userData, responseError, fetching } = useApi('/api/user');

    if(error || responseError) {
        return (
            <p> Error: { error + " | " + responseError } </p>
        );
    }

    if(user == undefined || userData == null) {
        return <Container title="ENGR 1411 | Dashboard" loading={true} />
    }

    if(userData?.code == 404) {
        return <NewUser />;
    }

    return (
        <Container title="ENGR 1411 | Dashboard" className={"flex"} loading={isLoading || fetching}>
            <Navbar />

            <div>
                <h1 style={{ borderBottom: "2px solid var(--color-bg-secondary)", marginBottom: "0.2rem"}}> Welcome back, { userData.name }! </h1> 
            </div>
        </Container>
    )
}

export default Dashboard;