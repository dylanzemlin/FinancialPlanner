// pages/index.js
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import Container from '../../container';
import Casifiy from 'js-convert-case';

const usStates = [
    { name: 'ALABAMA', abbreviation: 'AL' },
    { name: 'ALASKA', abbreviation: 'AK' },
    { name: 'AMERICAN SAMOA', abbreviation: 'AS' },
    { name: 'ARIZONA', abbreviation: 'AZ' },
    { name: 'ARKANSAS', abbreviation: 'AR' },
    { name: 'CALIFORNIA', abbreviation: 'CA' },
    { name: 'COLORADO', abbreviation: 'CO' },
    { name: 'CONNECTICUT', abbreviation: 'CT' },
    { name: 'DELAWARE', abbreviation: 'DE' },
    { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC' },
    { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM' },
    { name: 'FLORIDA', abbreviation: 'FL' },
    { name: 'GEORGIA', abbreviation: 'GA' },
    { name: 'GUAM', abbreviation: 'GU' },
    { name: 'HAWAII', abbreviation: 'HI' },
    { name: 'IDAHO', abbreviation: 'ID' },
    { name: 'ILLINOIS', abbreviation: 'IL' },
    { name: 'INDIANA', abbreviation: 'IN' },
    { name: 'IOWA', abbreviation: 'IA' },
    { name: 'KANSAS', abbreviation: 'KS' },
    { name: 'KENTUCKY', abbreviation: 'KY' },
    { name: 'LOUISIANA', abbreviation: 'LA' },
    { name: 'MAINE', abbreviation: 'ME' },
    { name: 'MARSHALL ISLANDS', abbreviation: 'MH' },
    { name: 'MARYLAND', abbreviation: 'MD' },
    { name: 'MASSACHUSETTS', abbreviation: 'MA' },
    { name: 'MICHIGAN', abbreviation: 'MI' },
    { name: 'MINNESOTA', abbreviation: 'MN' },
    { name: 'MISSISSIPPI', abbreviation: 'MS' },
    { name: 'MISSOURI', abbreviation: 'MO' },
    { name: 'MONTANA', abbreviation: 'MT' },
    { name: 'NEBRASKA', abbreviation: 'NE' },
    { name: 'NEVADA', abbreviation: 'NV' },
    { name: 'NEW HAMPSHIRE', abbreviation: 'NH' },
    { name: 'NEW JERSEY', abbreviation: 'NJ' },
    { name: 'NEW MEXICO', abbreviation: 'NM' },
    { name: 'NEW YORK', abbreviation: 'NY' },
    { name: 'NORTH CAROLINA', abbreviation: 'NC' },
    { name: 'NORTH DAKOTA', abbreviation: 'ND' },
    { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP' },
    { name: 'OHIO', abbreviation: 'OH' },
    { name: 'OKLAHOMA', abbreviation: 'OK' },
    { name: 'OREGON', abbreviation: 'OR' },
    { name: 'PALAU', abbreviation: 'PW' },
    { name: 'PENNSYLVANIA', abbreviation: 'PA' },
    { name: 'PUERTO RICO', abbreviation: 'PR' },
    { name: 'RHODE ISLAND', abbreviation: 'RI' },
    { name: 'SOUTH CAROLINA', abbreviation: 'SC' },
    { name: 'SOUTH DAKOTA', abbreviation: 'SD' },
    { name: 'TENNESSEE', abbreviation: 'TN' },
    { name: 'TEXAS', abbreviation: 'TX' },
    { name: 'UTAH', abbreviation: 'UT' },
    { name: 'VERMONT', abbreviation: 'VT' },
    { name: 'VIRGIN ISLANDS', abbreviation: 'VI' },
    { name: 'VIRGINIA', abbreviation: 'VA' },
    { name: 'WASHINGTON', abbreviation: 'WA' },
    { name: 'WEST VIRGINIA', abbreviation: 'WV' },
    { name: 'WISCONSIN', abbreviation: 'WI' },
    { name: 'WYOMING', abbreviation: 'WY' }
];

const NewUser: NextPage = () => {
    const [name, setName] = useState("");
    const [age, setAge] = useState<number>();
    const [state, setState] = useState("OK");
    const [submitting, setSubmitting] = useState(false);

    const router = useRouter();

    const onFormSubmitted = async (formInfo: any) => {
        formInfo.preventDefault();

        if (age == undefined || age < 16 || age > 120) {
            toast.error('You have entered an invalid age');
            return;
        }

        if (name == undefined || name.length <= 0) {
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

        if (postResp.status != 200) {
            const text = await postResp.text();
            setSubmitting(false);
            toast.error(`Failed to create user: ${text}`);
        }

        router.reload();
    }

    if (submitting) {
        return <Container title="ENGR 1411 | Welcome!" loading={true} />;
    }

    return (
        <Container title="ENGR 1411 | Welcome!">
            <div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                <h1> Welcome to the 1411 Financial Planner! </h1>
                <p> 
                    To get started, we need to collect some information about you.
                    Everything below is securely stored and used only for financial calculations such as state taxes, etc.
                </p>

                <div style={{ maxWidth: "15rem" }}>
                    <form autoComplete="off" style={{ gap: "1rem" }} className="flex column" onSubmit={onFormSubmitted}>
                        <div className="flex column">
                            <label htmlFor="name"> Full Name </label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} style={{ marginTop: "0.25rem" }} placeholder="John Doe" />
                        </div>

                        <div className="flex column">
                            <label htmlFor="age"> Age </label>
                            <input type="text" id="age" value={age} onChange={(e) => setAge(parseInt(e.target.value))} style={{ marginTop: "0.25rem" }} placeholder="18" />
                        </div>

                        <div className="flex column">
                            <label htmlFor="state"> State </label>
                            <select style={{ marginTop: "0.25rem" }} value={state} onChange={(e) => setState(e.target.value)}>
                                {usStates.map(x => {
                                    return <option selected value={x.abbreviation}>{Casifiy.toHeaderCase(x.name)}</option>
                                })}
                            </select>
                        </div>

                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        </Container>
    )
}
export default NewUser;