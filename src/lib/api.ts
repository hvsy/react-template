import axios, {AxiosRequestConfig} from "axios";
import {Token} from "./token";
import _ from "lodash";

export const AxiosInstance = axios.create({
    baseURL : process.env.API,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept' : 'application/json',
    },
    withCredentials: true,
});
AxiosInstance.interceptors.request.use((config) => {
    const token = Token.get();
    if(token && config.headers){
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});
AxiosInstance.interceptors.response.use(r=>r, (error) => {
    const statusCode = _.get(error,'response.status');
    if(statusCode === 401){
        Token.remove();
    }
    return Promise.reject(error);
});
export function api<T>(config : AxiosRequestConfig){
    return AxiosInstance.request<T>(config).then(r=>r.data);
}



