import { NextPage } from 'next';
import React, { useState } from 'react';
import Container from '../../modules/container';
import Styles from './login.module.scss';

const Login: NextPage = (props) => {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ name, setName ] = useState("");

    const onFormSubmitted = (e: any) => {
        e.preventDefault();
    };

    return (
        <Container title="ENGR 1411 | Login" className={`flex centered column ${Styles.login}`}>
            <form onSubmit={onFormSubmitted} autoComplete="off" className={`flex centered column`}>
                <h1> Login </h1>

                <input type="text" placeholder="John Doe" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="email@company.com" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="abc123" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="submit" value="Submit" />
            </form>
        </Container>
    )
}

export default Login;