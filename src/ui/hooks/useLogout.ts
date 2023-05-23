import {useUser} from "@/containers/AuthContainer";
import {api} from "@/lib/api";
import {Token} from "@/lib/token";
import { useNavigate } from "react-router-dom";
import {useCallback} from "react";

export function useLogout(){
    const [user,refresh] = useUser();
    const nav = useNavigate();
    const logout = useCallback(()=>{
        api({
            method: 'post',
            url: "/api/admin/logout",
        }).then(() => {
            Token.remove();
            refresh(null);
            nav('/login');
        });
    },[]);
    return logout;
}
