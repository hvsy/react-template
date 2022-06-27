import {Form, FormInstance} from "antd";
import {useCallback, useRef, useState} from "react";
import _ from "lodash";

export type LaravelFormSubmit = (values: any) => Promise<any>;
export function useLaravelForm(callback: LaravelFormSubmit,formInstance ?: FormInstance){
    const [submitting,setSubmitting] = useState(false);
    const [form] = Form.useForm(formInstance);
    const [ formError, setFormError ] = useState<any>({});
    const formErrorRef = useRef();
    formErrorRef.current = formError;
    const error = useCallback((name: string) => {
        const errors = formErrorRef.current?.[name];
        if(errors){
            return {
                validateStatus: 'error' as ("" | "error" | "success" | "warning" | "validating" | undefined),
                help: (errors as []).join("\n"),
            };
        }
        return {};
    }, []);
    const onFieldsChange = useCallback((changedFields : any[]) => {
        const keys = changedFields.map((f) => {
            const name = f.name;
            return _.isArray(name) ? name.join('.') : name;
        });
        setFormError(_.omit(formErrorRef.current, ...keys));
    },[]);
    const reset = () => {
        form.resetFields();
        setFormError({});
    };
    return [form,{
        field(name : string){
            return {
                name,
                ...error(name),
            }
        },
        error,
        submitting,
        onFieldsChange,
        reset,
        confirmation(name : string,message : string){
            return async(rule : any, value : string) => {
                const password = form.getFieldValue(name);
                if(password !== value){
                    throw message;
                }
                return true;
            }
        },
        async submit(){
            if(submitting) return;
            setSubmitting(true);
            try{
                await form.validateFields();
            }catch(e){
                setSubmitting(false)
                return false;
            }
            try{
                const values = form.getFieldsValue();
                // await api({
                //     method : 'get',
                //     url : 'sanctum/csrf-cookie',
                // });
                const result = await callback(values);
                reset();
                return result;
            }catch(e){
                const status = _.get(e, 'response.status');
                if(status === 422){
                    const data = _.get(e, 'response.data.errors');
                    setFormError(data);
                    return false;
                }
                throw e;
            }finally{
                setSubmitting(false)
            }
        },
    }] as const;
}
