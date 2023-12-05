import {useEffect} from "react";
import {Echo} from "@lib/echo";
import {PresenceChannel} from "laravel-echo";

export type ChannelCallback = (channel : PresenceChannel)=>void;
export function useChannel(name : string,callback : ChannelCallback){
    useEffect(() => {
        try{
            const channel = Echo.join(name);
            callback(channel);
        }catch(e){
            console.error(e);
            return () => {

            };
        }
        return () => {
            Echo.leave(name)
        }
    },[name]);
}
