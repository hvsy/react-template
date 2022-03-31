import {GetState, SetState, State, StateCreator, StoreApi} from "zustand/vanilla";
import produce, {Draft} from "immer";
import create from "zustand";

type ImmerConfig<T extends State,CustomGetState extends GetState<T>,
        CustomStoreApi extends StoreApi<T>> = StateCreator<T, (partial: ((draft: Draft<T>) => void) | T, replace?: boolean) => void, CustomGetState, CustomStoreApi>;
const immer = <T extends State,
        CustomSetState extends SetState<T>,
        CustomGetState extends GetState<T>,
        CustomStoreApi extends StoreApi<T>>(
        config: ImmerConfig<T, CustomGetState, CustomStoreApi>): StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi> =>{
            return (set, get, api) => {
                return config((partial, replace) => {
                            const nextState = typeof partial === 'function' ? produce(partial as (state: Draft<T>) => T) : (partial as T);
                            return set(nextState, replace);
                        },
                        get,
                        api,
                );
            }
}


export function createImmerStore<T extends State = object,CustomSetState extends SetState<T> = SetState<T>, CustomGetState extends GetState<T> = GetState<T>,
        CustomStoreApi extends StoreApi<T> = StoreApi<T>>(callback : ImmerConfig<T, CustomGetState, CustomStoreApi>){
    return create<T,CustomSetState,CustomGetState,CustomStoreApi>(immer<T,CustomSetState,CustomGetState,CustomStoreApi>(callback));
}
