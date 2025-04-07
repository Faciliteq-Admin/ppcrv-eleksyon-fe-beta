import { useEffect, useState } from "react";
import { getRequest } from "../utils/apiHelpers";

export const useElectionResults = (page: number, limit: number, uploadBatchNum?: number) => {
    const [data, setData] = useState<any[]>();
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const getElectionResults = async (regName?: string, prvName?: string, munName?: string, brgyName?: string) => {
        let path = `/results?page=${page}&limit=${limit}`;
        let filters = [];
        if (uploadBatchNum) filters.push(`uploadBatchNum=${uploadBatchNum}`);
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