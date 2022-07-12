import {useCallback, useEffect, useState} from "react";
import useSWR, { BareFetcher } from "swr";
import useSWRInfinite from 'swr/infinite'

import {TablePaginationConfig} from "antd";
import _ from "lodash";

export type LaravelPagination<T extends any> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number;
};

export type LaravelListOptions<Data> = {
    initialPageSize ?: number;
    fetcher ?: BareFetcher<Data> | null;
};
export function useLaravelList<Data = any,Error = any>(url: string|null, options : LaravelListOptions<LaravelPagination<Data>> = {initialPageSize : 10, fetcher : null}){
    const {initialPageSize = 10,fetcher = null} = options;
    let finalUrl = null;
    const [ page, setPage ] = useState(1);
    const [ pageSize, setPageSize ] = useState(initialPageSize);
    if(url){
        const [ path, qs = '' ] = url.split('?');
        const query = new URLSearchParams(qs || '');
        query.set('page', page + '');
        query.set('page_size', pageSize + '');
        finalUrl = [ path, query.toString() ].filter(t => !!t).join('?');
    }
    useEffect(() => {
        setPage(1);
    },[url]);

    const {
              data,
              ...others
          } = useSWR<LaravelPagination<Data>,Error>(finalUrl,fetcher);
    const actions = {
        onlyOne(){
            return data?.total === 1;
        },
        isFirst(){
            return data?.current_page === 1;
        },
        isLast(){
            return data?.current_page === data?.last_page;
        },
    };
    const pagination: false | TablePaginationConfig = data ? {
        onChange(page: number, pageSize: number){
            setPage(page);
            setPageSize(pageSize);
        },
        current: data.current_page,
        pageSize: data.per_page,
        total: data.total,
        hideOnSinglePage : true,
    } : false;
    return {
        data : data?.data,
        next(){
            if(!actions.isLast()){
                setPage(page + 1);
            }
        },
        prev(){
            if(!actions.isFirst()){
                setPage(page - 1);
            }
        },
        modify: function (hit : (data:Data)=>boolean, data: Data,merge : boolean = false) {
            return others.mutate(async (response ?: LaravelPagination<Data>) => {
                if (!response) return undefined;
                const cloned = {
                    ...response,
                    data: [...response.data],
                };
                const idx = _.findIndex(cloned.data,hit);
                if(idx !== -1){
                    if(merge){
                        cloned.data[idx] = {...cloned.data[idx],...data};
                    }else{
                        cloned.data[idx] = data;
                    }
                }
                return cloned;
            },{
                revalidate : false,
            })
        },
        pagination,
        ...actions,
        ...others,
    };
}
export type LaravelListReturn = ReturnType<typeof useLaravelList>;

function getKey<T>(url : string|null){
    return (pageIndex : number,previousPageData : LaravelPagination<T>) => {
        if(!url) return null;
        console.log("infinite:", url,previousPageData,pageIndex);
        if(previousPageData && previousPageData.data.length === 0){
            return null;
        }
        if(pageIndex === 0){
            return url;
        }
        const [ path, qs = '' ] = url!.split('?');
        const query = new URLSearchParams(qs || '');
        query.set('page', (pageIndex + 1) + '');
        return [ path, query.toString() ].join('?');
    }
}
export function useLaravelInfinite<T = any>(url: string | null,options : LaravelListOptions<LaravelPagination<T>> = {initialPageSize : 10, fetcher : null}){
    const {initialPageSize = 10,fetcher = null} = options;
    const keyer = useCallback((page : number,pp : any) => {
        return getKey(url)(page,pp);
    },[url])
    const {data,isValidating,size,setSize,mutate,error,isLoading} =useSWRInfinite<LaravelPagination<T>>(keyer,fetcher);
    const isLoadingInitialData = !data && !error;
    const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
    const isEmpty = data?.[0]?.data?.length === 0;
    const isReachingEnd = isEmpty || (data && data?.[data.length - 1]?.data?.length < initialPageSize);
    const isRefreshing = isValidating && data && data?.length === size;
    return {
        data : ([] as T[]).concat(...(data||[]).filter(t=>!!t).map((i) => {
            return i.data;
        })),
        isLoading,
        isLoadingInitialData,
        isLoadingMore,
        isReachingEnd,
        isRefreshing,
        mutate,
        error,
        async next(){
            if(!isEmpty && !isReachingEnd){
                await setSize((s)=>{
                    console.log('prev:',s,'next:',s+1);
                    return s+1;
                });
            }
        }

    }
}
