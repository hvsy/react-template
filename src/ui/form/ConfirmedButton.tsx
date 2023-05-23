import {FC, ReactNode, useState} from "react";
import {Button, ButtonProps, Popconfirm} from "antd";
import {useAsyncClick} from "@/hooks/useAsyncClick";

export type ConfirmedButtonProps = Omit<ButtonProps,'onClick'|'children'> & {
    content ?: ReactNode;
    children ?: ReactNode;
    onClick ?: ()=>Promise<any>|void;
};

export const ConfirmedButton : FC<ConfirmedButtonProps> = (props) => {
    const {content,children,onClick,disabled,...others} = props;
    const [loading,click] = useAsyncClick(onClick);
    return <Popconfirm title={content} disabled={disabled} onConfirm={click}>
        <Button  {...others} loading={loading} disabled={disabled}>
            {children}
        </Button>
    </Popconfirm>
};
