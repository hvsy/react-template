import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AxiosInstance} from "@/lib/api";
import _ from "lodash";
import useSWR from "swr";
import {LoadingOutlined} from "@ant-design/icons";

export type AuthContainerProps = {
    redirect : string;
    user : string;
    children : ReactNode,
    
};


const UserContext = createContext<{user:User|null}>({
    user : null,
});

export function useUser(){
    return useContext(UserContext).user!;
}


export function UserProvider(props : {url : string,children : ReactNode}){
    const {url,children} = props;
    const {data} = useSWR(url);
    if(!data){
        return <div className={'flex-1 flex flex-col justify-center items-center'}>
            <LoadingOutlined />
        </div>;
    }
    return <UserContext.Provider value={{user:data}}>
        {children}
    </UserContext.Provider>
}


export function AuthContainer(props : AuthContainerProps){
    const {redirect,user} = props;
    const nav =useNavigate();
    const [mounted,setMounted] = useState(false);
    useEffect(() => {
        const interceptor = AxiosInstance.interceptors.response.use(r=>r, (error) => {
            const isRedirect = _.get(error,'config.authRedirect',true);
            const status = _.get(error,'response.status');
            if(status === 401 && isRedirect){
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
    return <UserProvider url={user}>
        {props.children}
    </UserProvider>
}
