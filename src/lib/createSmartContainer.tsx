import React, {Context, createContext, FC, ReactNode, useContext} from "react";

export type SmartContextCallback<State,Props,Actions> = (initialState ?: State,props ?: Props)=>Actions;

export function createSmartContainer<Actions extends any = {},State extends any = {},Props extends any = {}>(
    callback : SmartContextCallback<State,Props,Actions>) : {
    Provider : FC<{value ?: Actions,initialState  ?: State,children?:ReactNode} & Props>,
    Context : Context<Actions|null>,
    useContainer : ()=>Actions,
}{
    const Context = createContext<Actions|null>(null);
    return {
        useContainer(){
            return useContext(Context)!;
        },
        Context,
        Provider : (props)=>{
            const {children,value,initialState,...others} = props as any;
            const state = value || callback(initialState,others);
            return <Context.Provider value={state}>{children}</Context.Provider>;
        }
    }
}
