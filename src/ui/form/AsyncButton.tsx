import {FC, ReactNode, useMemo, useState} from "react";
import _ from "lodash";
import {Button, ButtonProps} from "antd";

export type AsyncButtonProps =  Omit<ButtonProps,'onClick'> & {
    onClick ?: ()=>(Promise<any>|void);
    children ?: ReactNode,
} ;

export const AsyncButton : FC<AsyncButtonProps> = (props)=>{
    const {children,onClick,...others} = props;
    const [loading,setLoading] = useState(false);
    return <Button {...others} onClick={async(e) => {
        e.preventDefault();
        e.stopPropagation();
        if(loading) return;
        setLoading(true);
        try{
            if(onClick){
                await onClick();
            }
        }finally{
            setLoading(false);
        }
    }} loading={loading}>
        {children}
    </Button>;
}
