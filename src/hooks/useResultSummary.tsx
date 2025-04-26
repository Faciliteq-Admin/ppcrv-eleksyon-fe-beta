import { useEffect, useState } from "react";
import { getRequest } from "../utils/apiHelpers";
import { getActiveBatchNumber, saveActiveBatchNumber } from "../utils/functions";

export const useResultSummary = (page: number, limit: number) => {
    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const getResultSummary = async (search?: string) => {
        let path = `/results/summary?page=${page}&limit=${limit}`;
        if (search) path += `&search=${search}`;

        const activeBatch = getActiveBatchNumber();
        if (activeBatch) {
            path += `&uploadBatchNum=` + activeBatch;
        } else {
            let res = await getRequest('/settings?field=activeBatch');
            if (res.data && res.data.length > 0) {
                saveActiveBatchNumber(res.data[0].value);
                path += `&uploadBatchNum=` + res.data[0].value;
            }
        }

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