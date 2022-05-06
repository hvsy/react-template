import React, { FC } from "react";

export type LoadableProps =  {
    callback ?: (()=>Promise<any>) | null,
} ;

export const Loadable :FC<LoadableProps> = (props) => {const {callback} = props;
    if(!callback) return null;
    const Component = React.lazy(()=>callback());
    return <React.Suspense fallback={<div className={''}>
        loading...
    </div>}>
        <Component />
    </React.Suspense>
}
