import { useCallback, useEffect, useState } from "react";
import { awaitTimeout } from "./functions";
import axios from "axios";

const BASE_URL = 'https://2x6uq9lh9a.execute-api.us-east-1.amazonaws.com/v1';

function useGetData(path: string) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>();

    const loader = useCallback(async () => {

        const response = await axios.get(BASE_URL + path);
        console.log(response.data);

        setData(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        loader();
    }, [loader]);

    return { data, loading };
};

export default useGetData;