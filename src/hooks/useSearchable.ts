import {useCallback, useState} from "react";
import {useMatchMutate} from "@/hooks/useMatchMutate";
import qs from "qs";
import _ from "lodash";

export function useSearchable(url : string){
    const [query,setQuery] = useState<string>('');
    const mutate = useMatchMutate();
    const refresh = useCallback(()=>{
          return mutate(url);
    },[url]);
    return {
        replace(base : string){
            return `${base}?${query}`;
        },
        touched(){
            return !!query;
        },
        url : `${url}?${query}`,
        set(data : any,merge : boolean = false){
            if(merge){
                const original= qs.parse(query);
                setQuery(qs.stringify({
                    ...original,
                    ...data,
                }))
            }else{
                setQuery(qs.stringify(data,{
                    arrayFormat : 'brackets',
                    serializeDate : function (date) {
                        return date.toUTCString();
                    }
                }));
            }
        },
        modify: function (key: string, value: string) {
            const data = qs.parse(query);
            _.set(data, key, value);
            setQuery(qs.stringify(data));
        },
        remove(key:string){
            const data = qs.parse(query);
            setQuery(qs.stringify(_.omit(data, key, )));
        },
        refresh,
    }

}
