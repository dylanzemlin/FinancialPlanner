
import React, { useEffect, useState } from 'react';

function initialState(args?: any) {
    return {
        response: null,
        responseError: null,
        fetching: true,
        ...args
    };
}

export default (url: string, options = {}) => {
    const [state, setState] = useState(() => initialState());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(url, {
                    ...options
                });

                setState(initialState({
                    response: await res.json(),
                    fetching: false
                }));
            } catch (responseError) {
                setState(initialState({
                    responseError
                }));
            }
        };
        fetchData();
    }, []);
    return state;
};