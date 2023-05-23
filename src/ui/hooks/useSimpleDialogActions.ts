import {useState} from "react";

export type DialogActions<T> = {
    show : (data ?: T)=>void;
    close : Function;
}

export type DialogState<T = any> = readonly [boolean,DialogActions<T>,T|undefined|null];


export function useSimpleDialogActions<T = any>() :DialogState<T>{
    const [data, setData] = useState<T | undefined | null>(undefined);
    const show = data !== undefined;
    const actions = {
        show(data ?: T){
                if(data){
                    setData(data);
                }else{
                    setData(null);
                }
        },
        close(){
            setData(undefined);
        },
    };
    return [show,actions,data] as const;
}
