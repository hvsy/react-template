import {Dialog, DialogProps} from "@/ui/fragments/Dialog";
import {Spin} from "antd";


export type UseComponentDialogOptions = DialogProps;


export function useComponentDialog<T extends Object>(component : ReactComponent<T>,options : UseComponentDialogOptions & T){
    const ComponentClass  = component;
    const {open,loading,...others} = options;
    if(!open)  return null;
    return <Dialog
        open={open}
        loading={loading}
        {...others}
    >
        {loading ? <div className={'flex flex-col justify-center items-center'}>
            <Spin/>
        </div> : <ComponentClass {...(others as T)} />}
    </Dialog>;

}
