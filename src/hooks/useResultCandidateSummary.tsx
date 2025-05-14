import { useEffect, useState } from "react";
import { getRequest } from "../utils/apiHelpers";
import { getActiveBatchNumber, saveActiveBatchNumber } from "../utils/functions";

export const useResultCandidateSummary = (page: number, limit: number) => {
    const [data, setData] = useState<any[]>();
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const getResultSummary = async (candidateName: string, regName?: string, prvName?: string, munName?: string, brgyName?: string) => {
        let path = `/results/summary/candidate/raw?page=${page}&limit=${limit}`;
        path += `&candidateName=${candidateName}`;
        if (regName) path += `&regName=${regName}`;
        if (prvName) path += `&prvName=${prvName}`;
        if (munName) path += `&munName=${munName}`;
        if (brgyName) path += `&brgyName=${brgyName}`;

        setLoading(true);
        getRequest(path).then(response => {
            setData(response.data.items);
            setTotal(response.data.total);
        }).finally(() => {
            setLoading(false);
        });
    };

    return { data, total, loading, getResultSummary };
}