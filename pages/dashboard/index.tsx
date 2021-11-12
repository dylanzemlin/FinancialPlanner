// pages/index.js
import { useUser } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { CartesianGrid, Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import React from 'react';
import Navbar from '../../components/nav';
import useApi from '../../lib/useApi';
import Container from '../../modules/container';
import NewUser from '../../modules/dashboard/newuser';

const Dashboard: NextPage = (props) => {
    const { user, error, isLoading } = useUser();
    const { response: userData, responseError, fetching } = useApi('/api/user');
    const router = useRouter();

    if (error || responseError) {
        return (
            <p> Error: {error + " | " + responseError} </p>
        );
    }

    if (user == undefined) {
        return <Container title="ENGR 1411 | Dashboard" loading={true} />
    }

    if (userData == undefined) {
        return <Container title="ENGR 1411 | Dashboard" loading={true} />
    }

    if (userData?.code == 404) {
        return <NewUser />;
    }

    const date = new Date();
    const data: any[] = [];

    for (let m = 6; m <= 12; m++) {
        for (let i = 1; i < 28; i += 3) {
            let x = Math.floor(Math.random() * 800) + 500;
            data.push({
                date: `${m}/${i}/2021`,
                estimated: x - Math.floor(Math.random() * 50),
                spending: x
            });
        }
    }

    return (
        <Container title="ENGR 1411 | Dashboard" className={"flex"} loading={isLoading || fetching}>
            <Navbar />

            <div style={{ overflowY: "scroll", width: "100%" }}>
                <h1 style={{ borderBottom: "2px solid var(--color-bg-secondary)", marginBottom: "0.2rem" }}> Welcome back, {userData.name}! </h1>

                <div style={{ width: "100%", marginBottom: "2rem" }}>
                    <h2> Summary for {new Date().toLocaleString('default', { month: 'long' })} ({date.getMonth() + 1}/01/{date.getFullYear()} to {date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}): </h2>

                    <div className="flex" style={{ gap: "3rem" }}>
                        <div>
                            <h3> Income </h3>
                            <p> Total Income: $0 </p>
                            <p> Estimated Income: $0 </p>
                        </div>

                        <div>
                            <h3> Expenses </h3>
                            <p> Total Expenses: $0 </p>
                            <p> Estimated Expenses: $0 </p>

                            <p> Largest Expense: $0 </p>
                            <p> Smallest Expense: $0 </p>
                            <p> Average Expense: $0 </p>
                        </div>
                    </div>

                    <h3 style={{ width: "100%", textAlign: "center" }}> Spending & Expenses </h3>
                    <ResponsiveContainer width="95%" height={400}>
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                            <XAxis dataKey="date" height={60} minTickGap={15}>
                                <Label value="Date" position="end" dy={20} fill={"var(--color-text-primary)"} offset={10} />
                            </XAxis>
                            <YAxis dataKey="spending">
                                <Label value="Amount" position="end" dx={-20} angle={90} fill={"var(--color-text-primary)"} offset={10} />
                            </YAxis>

                            <CartesianGrid stroke="var(--color-graph-chart)" />
                            <Line dot={false} type="natural" dataKey="spending" stroke="#ff7300" yAxisId={0} />
                            <Line dot={false} type="natural" dataKey="estimated" stroke="#0ff0ff" yAxisId={0} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Container>
    )
}

export default Dashboard; ``