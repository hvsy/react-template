import dayjs from "dayjs";
import {useEffect, useMemo, useState} from "react";
import {Prefix} from "@/lib/AppStorage";

function getInitialValue(key : string,duration : number){
    let initialValue = 0;
    const lastCreatedAt = localStorage.getItem(key);
    if(lastCreatedAt){
        const diff = dayjs().diff(dayjs(lastCreatedAt),'second');
        if(diff < duration){
            initialValue = duration - diff;
        }
    }
    return initialValue;
}

export function useCountdown(name : string,duration : number){
    const key = `${Prefix}__countdown_${name}__`;
    const iv = useMemo(() => {
        return getInitialValue(key,duration);
    },[key,duration]);
    const [initialValue,setInitialValue] = useState(iv);
    const [countdown,setCountdown] = useState(initialValue);
    useEffect(() => {
        if(!initialValue) return;
        let timer  : number|null = null;
        let next = () => {
            setCountdown((v) => {
                return v - 1;
            });
            timer = setTimeout(next,1000) as unknown as number;
        };
        next();
        return () => {
            if(timer){
                clearTimeout(timer);
            }
            
        }
    },[initialValue]);
    return {
        countdown,
        start(){
            localStorage.setItem(key,dayjs().format())
            setInitialValue(duration);
            setCountdown(duration);
        }
    }
}
