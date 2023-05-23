import {FC, ReactNode, useId, useState} from "react";
import {Button, ButtonProps} from "antd";
import { flushSync } from "react-dom";
import {useAsyncClick} from "@/hooks/useAsyncClick";

export type AsyncButtonProps =  Omit<ButtonProps,'onClick'> & {
    onClick ?: ()=>(Promise<any>|void);
    children ?: ReactNode,
} ;

export const AsyncButton : FC<AsyncButtonProps> = (props)=>{
    const {children,onClick,loading : tLoading,...others} = props;
    const [loading,click]  = useAsyncClick(onClick);
    return <Button {...others} loading={loading} onClick={click}>
        {children}
    </Button>;
};
