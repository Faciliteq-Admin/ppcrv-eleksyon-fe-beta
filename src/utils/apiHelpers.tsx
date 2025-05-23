import axios from "axios";
import { getUserSession } from "./functions";

const BASE_URL = process.env.REACT_APP_BASEURL;
const API_KEY = process.env.REACT_APP_API_KEY;

const getHeaders = () => {
    const headers: any = { 'x-api-key': API_KEY };

    let session = getUserSession();
    if (session) headers['Authorization'] = 'Bearer ' + session.token;

    return { headers };
}

const getRequest = async (path: string) => {

    try {
        const getRes = await axios.get(BASE_URL + path, getHeaders());
        // console.log({ getRes });

        return getRes.data;
    } catch (e) {
        console.log(e);
        return { success: false, error: e }
    }
}

const postRequest = async (path: string, payload: any) => {
    try {
        const postRes = await axios.post(BASE_URL + path, payload, getHeaders());
        // console.log({ postRes });

        return postRes.data;
    } catch (e) {
        console.log(e);
        return { success: false, error: e }
    }
}

const putRequest = async (path: string, payload: any) => {
    try {
        const putRes = await axios.put(BASE_URL + path, payload, getHeaders());
        // console.log({ putRes });

        return putRes.data;
    } catch (e) {
        console.log(e);
        return { success: false, error: e }
    }
}

export {
    getRequest,
    putRequest,
    postRequest,
}