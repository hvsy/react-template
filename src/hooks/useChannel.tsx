import {useEffect} from "react";
import {Echo} from "@lib/echo";

export function useChannel(name : string,callback : Function,error :Function){
    useEffect(() => {
        try{
            const channel = Echo.join(name);
            channel.error(error);
            channel.notification(callback);
        }catch(e){
            console.error(e);
            return () => {

            };
        }
        return () => {
            console.log(`leave : ${name}`);
            Echo.leave(name)
        }
    },[name]);
}
