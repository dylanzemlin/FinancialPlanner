// pages/index.js
import { useUser } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import Navbar from '../../components/nav';
import useApi from '../../lib/useApi';
import Container from '../../modules/container';

const Dashboard: NextPage = (props) => {
    const { user, error, isLoading } = useUser();
    const { response, responseError, fetching } = useApi('/api/user/finance');

    console.log(isLoading + " | " + fetching);
    return (
        <Container title="ENGR 1411 | Dashboard" loading={isLoading || fetching}>
            <Navbar />
        </Container>
    )
}

export default Dashboard;