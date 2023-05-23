import {useState} from "react";
import {DialogState} from "@/ui/hooks/useSimpleDialogActions";

export type UseDialogOptions = {
    onOk ?: ()=>any;
    onClose ?:()=>any;
    autoClose ?: boolean;
    state : DialogState,
};
export function useDialog(options : UseDialogOptions){
    const {onOk,onClose,state,autoClose = false} = options;
    const [show,actions] = state;
    if(!show){
        return [actions,null] as const;
    }
    return [actions,{
        visible:show,
        onOk : () => {
            if(!onOk) return;
            const result = onOk();
            if(autoClose && result && result['then']){
                result.then(actions.close)
            }
        },
        onCancel: () => {
            actions.close();
            onClose&&onClose();
        }
    }] as const;
}
