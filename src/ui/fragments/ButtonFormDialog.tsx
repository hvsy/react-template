import {LaravelFormSubmit, useLaravelForm} from "@/hooks/useLaravelForm";
import {
    DialogFormProps,
    useFormDialog,
    UseFormDialogFinalOptions,
} from "@/ui/fragments/FormDialog";


export type UseButtonFormDialogOptions<T extends any = any,F extends any = any> = Omit<UseFormDialogFinalOptions<T,F>,'formProps'|'field'>& {
    initialUrl ?: (string |((data : any)=>(string|null)));
};
export function useButtonFormDialog<T extends any = any,P extends any = any,F extends any = any>(component : ReactComponent<T & DialogFormProps<P>>|undefined,

                                                      callback : LaravelFormSubmit,
                                                      options :  UseButtonFormDialogOptions<T,F> & Omit<F,'dialogProps'|'formProps'|'field'>,
){

    // const [form, laravel] = useLaravelForm(callback);
    // const show = (data ?: any & {initialValues ?: any},reset  :boolean = true) => {
    //     // if(data?.initialValues){
    //     //     form.setFieldsValue(data?.initialValues);
    //     // }
    //     if(reset && data?.initialValues){
    //         form.setFieldsValue(data?.initialValues);
    //     }
    //     dlg.show(data);
    //
    // };
    // @ts-ignore
    const [holder, dlg] = useFormDialog<T>(component,{
        // formProps : {
        //     form,
        //     onFieldsChange : laravel.onFieldsChange,
        // }, ...laravel,
        // after(data : any){
        //     console.log('after:',data);
        //     form.setFieldsValue(data);
        // },
        callback,
        ...options,
    });
    return [holder,dlg] as const;
}
