import { useEffect, useState } from "react";

function initialState(args?: any) {
    return {
        response: null,
        responseError: null,
        fetching: true,
        ...args,
    };
}

// TODO: Refactor how this function works
export default (url: string, options = {}) => {
    const [state, setState] = useState(() => initialState());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(url, {
                    ...options,
                });

                setState(
                    initialState({
                        response: await res.json(),
                        fetching: false,
                    })
                );
            } catch (responseError) {
                setState(
                    initialState({
                        responseError,
                    })
                );
            }
        };
        fetchData();
    }, []);

    return state;
};
