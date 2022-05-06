import {ReactNode, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AxiosInstance} from "@/lib/api";
import _ from "lodash";

export type AuthContainerProps = {
    redirect : string;
    children : ReactNode,
};

export function AuthContainer(props : AuthContainerProps ){
    const {redirect} = props;
    const nav =useNavigate();
    const [mounted,setMounted] = useState(false);
    useEffect(() => {
        const interceptor = AxiosInstance.interceptors.response.use(r=>r, (error) => {
            const status = _.get(error,'response.status');
            if(status === 401){
                nav(redirect);
                return;
            }
            return Promise.reject(error);
        });
        setMounted(true);
        return () => {
            AxiosInstance.interceptors.response.eject(interceptor);
            setMounted(false);
        }
    },[]);
    if(!mounted) return null;
    return props.children
}
