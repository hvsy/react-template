import {FC,useCallback,  useState} from "react";
import { FormInstance, Modal, notification} from "antd";
import {useLaravelForm} from "@/hooks/useLaravelForm";
import {Callbacks} from "rc-field-form/lib/interface";
import {SWRResponse} from "swr";

export type ModelFormProps<T = any> = {
    id ?: T;
    form: FormInstance;
    field : (name : (string)|(string|number)[])=>any;
    initValues ?: any;
    onFieldsChange ?: Callbacks<any>['onFieldsChange']
};
export type ModelDialogProps<T=any> = {
    id ?: T;
    onSubmit : (values : any)=>Promise<any>;
    form ?: FormInstance;
    afterClose ?: ()=>void;
    Component : FC<ModelFormProps>;
    useFetch : (id ?: T)=>SWRResponse
};

export const ModelDialog = <T extends any = any>(props : ModelDialogProps<T>) => {
    const {Component,useFetch,onSubmit,afterClose,id,form : formInstance} = props;
    const [form, laravel] = useLaravelForm(onSubmit, formInstance);
    const detail = useFetch(id);
    let content = null;
    if(id){
        if(detail.isLoading){
            content = <div>Loading</div>;
        }else{
            content = <Component form={form} field={laravel.field} id={id} onFieldsChange={laravel.onFieldsChange}
                               initValues={detail?.data || {}}
                    />;
        }
    }else{
        content = <Component form={form} field={laravel.field} id={id} onFieldsChange={laravel.onFieldsChange}
                                       initValues={detail?.data || {}}
                            />;
    }
    return <Modal visible={true} onCancel={() => {
        laravel.reset();
        detail?.mutate();
        afterClose && afterClose();
    }} confirmLoading={laravel.submitting} onOk={() => {
        laravel.submit().then((values) => {
            detail?.mutate(values);
        });
    }}>
        {content}
    </Modal>
};

export type UseModelDialogOptions<T = any> = {
    Component: FC<ModelFormProps<T>>;
    creator: (values: any) => Promise<void>;
    updator: (id: T, values: any) => Promise<void>;
    afterClose ?: () => void;
    useFetch : (id ?: T)=>SWRResponse;
    form ?: FormInstance;
    autoClose ?: boolean;
};

export function useModelDialog<T = any>(options: UseModelDialogOptions<T>) {
    const {Component,autoClose = true, form,creator,useFetch, updator,afterClose} = options;
    const [id, setId] = useState<T | undefined | null>(undefined);
    const show = id !== undefined;
    const close = () => {
        setId(undefined);
        afterClose && afterClose();
    };
    const submit = useCallback(async (values : any) => {
        let data : any =null;
        if (id) {
            data = await updator(id!, values);
        } else {
            data = await creator(values);
        }
        notification.success({
            type : 'success',
            message : id ? '修改成功':'创建成功',
        });
        if(!id){
            close();
        }else if(autoClose){
            close();
        }
        if(data){
            return data;
        }
    },[id,creator,updator]);
    const actions = {
        create(e ?: React.MouseEvent<HTMLElement>) {
                    e && e.stopPropagation();
                    e && e.preventDefault();
                    setId(null);
                },
        edit(id: T) {
            setId(id);
        },
        close,
    };
    if(!show){
        return [actions,null] as const;
    }


    const dlg = <ModelDialog afterClose={close}
                            id={id!}
                            onSubmit={submit} Component={Component}
                            useFetch={useFetch}
                            form={form}
    />;

    return [actions,dlg] as const;
}
