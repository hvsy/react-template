import {useSimpleDialogActions} from "../hooks/useSimpleDialogActions";
import {useComponentDialog, UseComponentDialogOptions} from "./ComponentDialog";

export type UseButtonDialogOptions<T extends any = any,P extends any = any> = {
};
export function useButtonDialog<T extends Object>(component :  ReactComponent<T>,options : UseComponentDialogOptions & T){
    const [show,actions,data]= useSimpleDialogActions();
    const dlg = useComponentDialog<T>(component,{
        open:show,
        ...options,
        cancel :actions.close,
        footer:null,
        ...data,
    });
    return [dlg,actions] as const;
}
