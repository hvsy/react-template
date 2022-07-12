import React, { FC } from "react";
import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";

export type LoadableProps =  {
    callback ?: (()=>Promise<any>) | null,
} ;

const Loading = <LoadingOutlined style={{ fontSize: 24 }} spin />
export const Loadable :FC<LoadableProps> = (props) => {const {callback} = props;
    if(!callback) return null;
    const Component = React.lazy(()=>callback());
    return <React.Suspense fallback={<div className={'flex flex-col justify-center items-center w-full h-full'}>
        <Spin indicator={Loading} />
    </div>}>
        <Component />
    </React.Suspense>
}
