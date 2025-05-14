import { useEffect, useState } from "react";
import { getRequest } from "../utils/apiHelpers";
import { getActiveBatchNumber, saveActiveBatchNumber } from "../utils/functions";

export const useElectionResults = (page: number, limit: number) => {
    const [data, setData] = useState<any[]>();
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const getElectionResults = async (regName?: string, prvName?: string, munName?: string, brgyName?: string) => {
        let path = `/results/raw?page=${page}&limit=${limit}`;

        setLoading(true);
        getRequest(path).then(response => {
            setData(response.data.items);
            setTotal(response.data.total);
        }).finally(() => {
            setLoading(false);
        });
    };

    return {
        data,
        total,
        loading,
        getElectionResults,
    };
}