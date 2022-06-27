import {FC, ReactNode, useMemo, useState} from "react";
import _ from "lodash";

export type AsyncButtonProps =  {
    onClick ?: ()=>(Promise<any>|void);
    className?: string;
    type ?: 'primary'| 'default';
    children ?: ReactNode,
} ;

export const AsyncButton : FC<AsyncButtonProps> = (props)=>{
    const {children,onClick,type,className = '',...others} = props;
    const [loading,setLoading] = useState(false);
    const cname = `flex flex-row items-center space-x-1 py-1 select-none cursor-pointer  ${className} ${loading ? 'relative' : ''}`;
    const classNames = useMemo(() => {
        return className.split(' ').filter(t=>!!t);
    },[className]);
    const bg = _.find(classNames, (which) => {
        return _.startsWith(which,'bg-');
    });
    const color = _.find(classNames,(which)=>{
        return _.startsWith(which,'text-');
    });
    return <div {...others} onClick={async(e) => {
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
    }} className={cname}>
        {loading  ? <div className={'invisible'}>{children}</div>: children}
        {loading && <div className={`${bg||''} absolute inset-0 flex flex-col justify-center items-center`}>
            <svg className={`animate-spin h-5 w-5 ${color} dark:text-white`} xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>}
    </div>;
}
