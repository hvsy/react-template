import * as React from "react";

export type FormItemConverterProps<From = any,To = any> = {
    value ?: From;
    onChange ?: (value ?: From)=>void;
    from : (value ?: From)=>To|undefined;
    to : (value ?: To)=>From|undefined;
    children : React.ReactElement,
}

export function FormItemConverter<From = any,To = any>(props : FormItemConverterProps<From,To>){
    const {value,onChange,children,from,to} = props;
    return React.cloneElement(children,{
        value : from ? from(value) : value,
        onChange(v : any){
            const tv = v?.target?.value !== undefined ? v.target.value  : v;
            onChange &&  onChange(to(tv));
        }
    })
};;
