import { useEffect, useState } from "react";
import { getRequest } from "../utils/apiHelpers";
import { getActiveBatchNumber, saveActiveBatchNumber } from "../utils/functions";

export const useResultPrecinctSummary = (page: number, limit: number) => {
    const [data, setData] = useState<any[]>();
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState<any|undefined>();
    const [loading, setLoading] = useState(false);

    const getResultSummary = async (regName?: string, prvName?: string, munName?: string, brgyName?: string, search?: string, type?: string, discrepancy?: string) => {
        let path = `/qr/summary?page=${page}&limit=${limit}`;
        if (type) path += `&type=${type}`;
        if (search) path += `&acmId=${search}`;
        if (regName) path += `&regName=${regName}`;
        if (prvName) path += `&prvName=${prvName}`;
        if (munName) path += `&munName=${munName}`;
        if (brgyName) path += `&brgyName=${brgyName}`;
        if (discrepancy) path += `&discrepancy=${discrepancy}`;

        setLoading(true);
        getRequest(path).then(response => {

            setData(response.data.items);
            setTotal(response.data.total);
            setCount(response.data.count);
        }).finally(() => {
            setLoading(false);
        });
    };

    return { data, total, loading, count, getResultSummary };
}