export async function getStudentAwards(
    cookie: string,
    userId: string
): Promise<StudentAwards | undefined> {
    // https://api.one.ou.edu/financialaidrespondedawardoffers

    const response = await fetch(
        "https://api.one.ou.edu/financialaidrespondedawardoffers",
        {
            headers: {
                Cookie: cookie,
                "X-User-Id": userId,
            },
        }
    );

    if (response.status != 200) {
        return undefined;
    }

    return await response.json();
}

export type StudentAidAward = {
    name: string;
    amountOffered: string;
    amountAccepted: string;
};

export type StudentAidYear = {
    aidYearCode: string;
    aidYearDescription: string;
    awards: StudentAidAward[];
};

export type StudentAwards = {
    aidYears: StudentAidYear[];
};

export async function getStudentFinances(cookie: string, userId: string) { }

export async function getStudentInformation(
    cookie: string,
    userId: string
): Promise<StudentInformation | undefined> {
    // https://api.one.ou.edu/PersonalAccountInformation

    const response = await fetch(
        "https://api.one.ou.edu/PersonalAccountInformation",
        {
            headers: {
                Cookie: cookie,
                "X-User-Id": userId,
            },
        }
    );

    if (response.status != 200) {
        return undefined;
    }

    return await response.json();
}

export type StudentInformation = {
    dottedEmail: string;
    emailAlias: string;
    preferredName: string;
    firstName: string;
    soonerId: string;
    middleName: string;
    lastName: string;
    ouNetId: string;
};
