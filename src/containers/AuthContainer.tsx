import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AxiosInstance} from "@/lib/api";
import _ from "lodash";
import useSWR, { KeyedMutator } from "swr";
import {LoadingOutlined} from "@ant-design/icons";

export type AuthContainerProps = {
    redirect : string;
    user : string;
    children : ReactNode,

};

export type UserContextValues = {
    user:User|null;
    refresh : (KeyedMutator<any>)|null;
};
const UserContext = createContext<UserContextValues>({
    user : null,
    refresh : null,
});

export function useUser(){
    const ctx= useContext(UserContext)!;
    return [ctx.user!,ctx.refresh!] as const;
}


export function UserProvider(props : {url : string,children : ReactNode}){
    const {url,children} = props;
    const {data,mutate} = useSWR(url);
    if(!data){
        return <div className={'flex-1 flex flex-col justify-center items-center'}>
            <LoadingOutlined />
        </div>;
    }
    return <UserContext.Provider value={{user:data,refresh : mutate}}>
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
