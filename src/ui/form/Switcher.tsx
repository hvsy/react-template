import { FC, useState } from "react";
import {Switch} from "antd";

export type SwitcherProps = {
    onChange ?: (value : boolean)=>Promise<void>;
    value : boolean;
};

export const Switcher : FC<SwitcherProps> = (props) => {
    const {onChange,value} = props;
    const [loading,setLoading] = useState(false);
    return <Switch loading={loading} checked={!!value} onChange={(checked,event) => {
        event.preventDefault();
        event.stopPropagation();
        if(loading) return;
        setLoading(true);
        if(onChange){
            onChange(checked).finally(() => {
                setLoading(false);
            })
        }else{
            setLoading(false);
        }
    }}/>
};
