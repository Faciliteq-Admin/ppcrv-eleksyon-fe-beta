import { useEffect, useState } from "react";
import { getRequest } from "../utils/apiHelpers";

export const useCandidates = (page: number, limit: number) => {
    const [data, setData] = useState<any[]>();
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const getCandidates = async (search?: string) => {
        let path = `/candidates?page=${page}&limit=${limit}`;
        if (search) path += `&search=${search}`;
        setLoading(true);
        getRequest(path).then(response => {
            setData(response.data.items);
            setTotal(response.data.total);
        }).finally(() => {
            setLoading(false);
        });
    };

    return { data, total, loading, getCandidates };
}