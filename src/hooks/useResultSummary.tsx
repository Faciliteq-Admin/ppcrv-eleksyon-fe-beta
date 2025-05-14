import { useState } from "react";
import { getRequest } from "../utils/apiHelpers";

export const useResultSummary = (page: number, limit: number) => {
    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const getResultSummary = async (search?: string) => {
        let path = `/results/summary/raw?page=${page}&limit=${limit}`;
        if (search) path += `&search=${search}`;

        setLoading(true);
        getRequest(path).then(response => {
            setData(response.data ? response.data.items : []);
            setTotal(response.data ? response.data.total : 0);
        }).finally(() => {
            setLoading(false);
        });
    };

    return { data, total, loading, getResultSummary };
}