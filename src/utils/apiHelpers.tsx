import axios from "axios";
import { getUserSession } from "./functions";

const BASE_URL = process.env.REACT_APP_BASEURL;
// const BASE_URL = 'https://esumbongmo-backend-beta.faciliteq.net/v1';

const getHeaders = () => {
    const headers: any = { 'x-api-key': 'k@2!-v-$j%5je-8!' };

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