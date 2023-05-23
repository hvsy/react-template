import {FC, forwardRef, useImperativeHandle, useRef} from "react";
import {useSimpleDialogActions} from "@/ui/hooks/useSimpleDialogActions";
import {FormInstance} from "antd";
import {useComponentDialog} from "@/ui/fragments/ComponentDialog";
import {DialogProps} from "@/ui/fragments/Dialog";
import _ from "lodash";
import useSWR from "swr";
import {useLaravelForm} from "@/hooks/useLaravelForm";

export type DialogFormProps<T = any> = {
    dialogProps : T,
    id?: any;
    formProps: {
        form: FormInstance
        initialValues?: any;
        onFieldsChange?: (changedField : any[],allFields : any[])=>void;
    };
    field: (name: (string) | (string | number)[], label ?: string,remoteName ?: (string) | (string | number)[]) => any;
    validators?: any;

};

export type UseFormDialogOptions<F extends any = any> = DialogProps<F> & {
    reset ?: Function;
    submit ?: (...args: any[])=>Promise<any>;
    submitting ?: boolean;
    initialUrl ?: string | ((data : any)=>(string|null));
};

export const FormContainer : FC<{
    data : any;
    component : ReactComponent<any>;
    options : UseFormDialogOptions & Omit<DialogFormProps,'dialogProps'>,
    close ?: Function;
}> = (props) => {
    const {data = {},options,component,close} = props;
    const {after,initialUrl,formProps,submit,reset,submitting,...others} = options;
    const cancel = () => {
        reset && reset();
        close && close();
    };
    const {initialValues = {},key,...othersData} = data || {};
    const fetcher = useSWR(initialUrl ? (_.isString(initialUrl) ? initialUrl : initialUrl({
        ...initialValues,
    })) : null);
    const {data : swrData,mutate,isLoading : swrLoading} = fetcher;

    const {initialValues  : formPropsInitialValues = {} ,...otherFormProps} = formProps ||{};
    // @ts-ignore
    const dlg = useComponentDialog<T>(component,{
        open: true,
        loading : initialUrl ? swrLoading : false,
        cancel,
        after(){
            if(initialUrl){
                mutate(data).then((res) => {
                    after?.(res)
                }).catch();
            }else{
                after?.();
            }
        },
        submit,
        submitting,
        dialogProps : othersData,
        key,
        // ...othersData,
        formProps : {
            ...otherFormProps,
            initialValues  :{
                ...(swrData || {}),
                ...formPropsInitialValues,
                ...initialValues,
            }
        },
        ...others,
    });
    return dlg;
};

export type UseFormDialogFinalOptions<T extends any,F extends any = any> = UseFormDialogOptions<F> & Omit<T,keyof DialogFormProps> & Omit<DialogFormProps,'dialogProps'> & {

};

export const FormDialogInner = forwardRef<{
    reset : (values : any)=>void;
},any>((props,ref)=>{

    const [form,laravel]  =useLaravelForm(props.options.callback);
    useImperativeHandle(ref, () => {
        return {
            reset(values : any){
                form.setFieldsValue(values);
            }
        }
    }, []);
    return <FormContainer
        data={props.data}
        component={props.component}
        close={props.close}
        options={{
            ...props.options,
            formProps : {
                form,
                onFieldsChange : laravel.onFieldsChange,
            },
            ...laravel,
            after(data : any){
                form.setFieldsValue(data);
            }
        }}
    />;
});
export function useFormDialog<T extends any,F extends any = any>(component : ReactComponent<T & DialogFormProps>|undefined,options : UseFormDialogFinalOptions<T,F>){
    const [show,actions,data] = useSimpleDialogActions();
    const ref = useRef<any>(null);
    let dlg = null;
    const showAction = (data ?: any,reset : boolean = true)=>{
        if(reset && data?.initivalValues){
            ref.current?.reset(data?.initivalValues);
        }
        actions.show(data);
    };
    if(show && component){
        dlg = <FormDialogInner
            ref={ref}
            data={data}
            component={component}
            close={actions.close}
            options={options}
        />;
    }
    return [dlg,{...actions,show : showAction}] as const;
}
