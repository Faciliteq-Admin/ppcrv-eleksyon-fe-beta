import { useEffect, useState } from "react";
import { getRequest } from "../utils/apiHelpers";

export const useLocations = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [regions, setRegions] = useState<any[]>([]);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [cityMuns, setCityMuns] = useState<any[]>([]);
    const [barangays, setBarangays] = useState<any[]>([]);

    const getRegions = async (regName?: string) => {
        let path = '/reports/locations?type=region';
        setIsLoading(true);
        const regRes = await getRequest(path);
        if (regRes && regRes.data) {
            setRegions(regRes.data);
        }
        setIsLoading(false);
    }

    const getProvinces = async (regName?: string) => {
        let path = '/reports/locations?type=province';
        if (regName) {
            path += '&regName=' + regName;
            setIsLoading(true);
            const provRes = await getRequest(path);
            if (provRes && provRes.data) {
                setProvinces(provRes.data);
            }
            setIsLoading(false);
        } else {
            setProvinces([]);
        }
    }

    const getMunicipalities = async (prvName?: string) => {
        let path = '/reports/locations?type=city';
        if (prvName) {
            path += `&prvName=${prvName}`;
            setIsLoading(true);
            const munRes = await getRequest(path);
            if (munRes && munRes.data) {
                setCityMuns(munRes.data);
            }
            setIsLoading(false);
        } else {
            setCityMuns([]);
        }
    }

    const getBarangays = async (prvName?: string, munName?: string) => {
        let path = '/reports/locations?type=barangay';
        if (prvName && munName) {
            if (prvName) path += `&prvName=${prvName}`;
            if (munName) path += `&munName=${munName}`;
            setIsLoading(true);
            const brgyRes = await getRequest(path);
            if (brgyRes && brgyRes.data) {
                setBarangays(brgyRes.data);
            }
            setIsLoading(false);
        } else {
            setBarangays([]);
        }
    }

    return {
        regions,
        provinces,
        cityMuns,
        barangays,
        isLoading,
        getRegions,
        getProvinces,
        getMunicipalities,
        getBarangays,
    };
}