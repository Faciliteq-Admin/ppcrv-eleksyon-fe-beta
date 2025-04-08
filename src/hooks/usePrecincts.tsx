import { useEffect, useState } from "react";
import { getRequest } from "../utils/apiHelpers";

export const usePrecincts = (page: number, limit: number) => {
    const [data, setData] = useState<any[]>();
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [regions, setRegions] = useState<any[]>([]);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [cityMuns, setCityMuns] = useState<any[]>([]);
    const [barangays, setBarangays] = useState<any[]>([]);

    const getPrecincts = async (regName?: string, prvName?: string, munName?: string, brgyName?: string) => {
        let path = `/precints?page=${page}&limit=${limit}`;
        let filters = [];
        if (regName) filters.push(`regName=${regName}`);
        if (prvName) filters.push(`prvName=${prvName}`);
        if (munName) filters.push(`munName=${munName}`);
        if (brgyName) filters.push(`brgyName=${brgyName}`);

        if (filters.length > 0) path += `&${filters.join('&')}`;

        setLoading(true);
        getRequest(path).then(response => {
            setData(response.data.items);
            setTotal(response.data.total);
        }).finally(() => {
            setLoading(false);
        });
    };

    const getRegions = async (regName?: string) => {
        let path = '/reports/locations?type=region';
        const regRes = await getRequest(path);
        if (regRes && regRes.data) {
            setRegions(regRes.data);
        }
    }

    const getProvinces = async (regName?: string) => {
        let path = '/reports/locations?type=province';
        if (regName) {
            path += '&regName=' + regName;
            const provRes = await getRequest(path);
            if (provRes && provRes.data) {
                setProvinces(provRes.data);
            }
        } else {
            setProvinces([]);
        }
    }

    const getMunicipalities = async (prvName?: string) => {
        let path = '/reports/locations?type=city';
        if (prvName) {
            path += `&prvName=${prvName}`;
            const munRes = await getRequest(path);
            if (munRes && munRes.data) {
                setCityMuns(munRes.data);
            }
        } else {
            setCityMuns([]);
        }
    }

    const getBarangays = async (prvName?: string, munName?: string) => {
        let path = '/reports/locations?type=barangay';
        if (prvName || munName) {
            if (prvName) path += `&prvName=${prvName}`;
            if (munName) path += `&munName=${munName}`;
            const brgyRes = await getRequest(path);
            if (brgyRes && brgyRes.data) {
                setBarangays(brgyRes.data);
            }
        } else {
            setBarangays([]);
        }
    }

    return {
        data,
        total,
        loading,
        regions,
        provinces,
        cityMuns,
        barangays,
        getPrecincts,
        getRegions,
        getProvinces,
        getMunicipalities,
        getBarangays,
    };
}