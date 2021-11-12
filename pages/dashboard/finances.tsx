// pages/index.js
import { useUser } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import React, { useEffect } from 'react';
import Navbar from '../../components/nav';
import useApi from '../../lib/useApi';
import Container from '../../modules/container';
import NewUser from '../../modules/dashboard/newuser';

const Dashboard: NextPage = (props) => {
    const { user, error, isLoading } = useUser();
    const { response: userData, responseError, fetching } = useApi('/api/user');
    const { response: financeData, responseError: financeError, fetching: financeFetching } = useApi('/api/user/finances');
    const router = useRouter();

    console.log(userData);
    console.log(financeData);

    if(error || responseError) {
        return (
            <p> Error: { error + " | " + responseError } </p>
        );
    }

    if(user == undefined) {
        return <Container title="ENGR 1411 | Finance Dashboard" loading={true} />
    }

    if(userData == undefined) {
        return <Container title="ENGR 1411 | Finance Dashboard" loading={true} />
    }

    if(userData?.code == 404) {
        return <Container title="ENGR 1411 | Finance Dashboard" loading={true} />
    }

    return (
        <Container title="ENGR 1411 | Finance Dashboard" className={"flex"} loading={isLoading || fetching}>
            <Navbar />

            <div className="flex column">
                <h1 style={{ borderBottom: "2px solid var(--color-bg-secondary)", marginBottom: "0.2rem"}}> Finances </h1>  

                <h2> Income </h2>
                <table id="incomeTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Recurring</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td> Paycheck </td>
                            <td> $1,502 </td>
                            <td> 11/12/2021 </td>
                            <td> No </td>
                        </tr>
                        <tr>
                            <td> Lottery </td>
                            <td> $11,302,123 </td>
                            <td> 07/25/2021 </td>
                            <td> No </td>
                        </tr>
                        <tr>
                            <td> Child Support </td>
                            <td> $200 </td>
                            <td> 11/01/2021 </td>
                            <td> Monthly </td>
                        </tr>
                    </tbody>
                </table>
                <button style={{
                    width: "8rem",
                    height: "2rem"
                }}> Create Income </button>

                
                <h2> Expenses </h2>
                <table id="expenseTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Recurring</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Spotify</td>
                            <td>$4.99</td>
                            <td>11/11/2021</td>
                            <td>Monthly</td>
                        </tr>
                        <tr>
                            <td>Disney Plus</td>
                            <td>$9.99</td>
                            <td>11/11/2021</td>
                            <td>Monthly</td>
                        </tr>
                        <tr>
                            <td>Amazon Prime</td>
                            <td>$59.99</td>
                            <td>01/26/2021</td>
                            <td>Yearly</td>
                        </tr>
                        <tr>
                            <td>Car Payment</td>
                            <td>$358.23</td>
                            <td>11/11/2021</td>
                            <td>Monthly</td>
                        </tr>
                    </tbody>
                </table>
                <button style={{
                    width: "8rem",
                    height: "2rem"
                }}> Create Expense </button>
            </div>
        </Container>
    )
}

export default Dashboard;