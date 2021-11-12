// pages/index.js
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Container from '../../container';

const NewUser: NextPage = () => {
    const [ name, setName ] = useState("");
    const [ age, setAge ] = useState<number>();
    const [ submitting, setSubmitting ] = useState(false);

    const router = useRouter();

    const onFormSubmitted = async (formInfo: any) => {
        formInfo.preventDefault();

        if(age == undefined || age < 16 || age > 120) {
            toast.error('You have entered an invalid age');
            return;
        }

        if(name == undefined || name.length <= 0) {
            toast.error('You have entered an invalid name');
            return;
        }

        // Submit
        setSubmitting(true);

        // Lets create a post request to submit our data :)
        let postResp = await fetch('/api/user/', {
            method: 'POST',
            body: JSON.stringify({
                'name': name,
                'age': age
            })
        });
        
        if(postResp.status != 200) {
            const text = await postResp.text();
            setSubmitting(false);
            toast.error(`Failed to create user: ${text}`);
        }
    }

    if(submitting) {
        return <Container title="ENGR 1411 | Welcome!" loading={true}/>;
    }

    return (
        <Container title="ENGR 1411 | Welcome!">
            <div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                <h1> Hi There! </h1>
                <p> You seem to be new here, so we need you to answer a few questions to continue </p>

                <div style={{ width: "10%" }}>
                    <form autoComplete="off" style={{ gap: "1rem" }} className="flex column" onSubmit={onFormSubmitted}>
                        <div>
                            <label htmlFor="name"> Full Name </label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} style={{ marginTop: "0.25rem" }} placeholder="John Doe"/>
                        </div>

                        <div>
                            <label htmlFor="age"> Age </label>
                            <input type="text" id="age" value={age} onChange={(e) => setAge(parseInt(e.target.value))} style={{ marginTop: "0.25rem" }} placeholder="18"/> 
                        </div>

                        <input type="submit" value="Submit" />
                    </form>
                </div>             
            </div>
        </Container>
    )
}
export default NewUser;