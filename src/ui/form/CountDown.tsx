import {FC, useState} from "react";
import {Button, ButtonProps, Form, FormInstance} from "antd";
import {useCountdown} from "@/hooks/useCountDown";
import _ from "lodash";

export type CountDownButtonProps =  Omit<ButtonProps,'onClick'> &{
    title ?: string;
    duration ?: number;
    id: string;
    onClick ?: ()=>Promise<any>
} ;


export const CountDownButton : FC<CountDownButtonProps> = (props)=>{
    const {title,duration = 60,id,onClick,disabled,...others} = props;
    const {countdown,start} = useCountdown(id,duration);
    const [loading,setLoading] = useState(false);
    
    const ing = countdown > 0 || loading;
    return <Button loading={loading} disabled={disabled || ing} onClick={() => {
        if(ing) return;
        setLoading(true);
        if(onClick){
            onClick().then(() => {
                start();
            }, () => {
            
            }).finally(() => {
                setLoading(false);
            })
        }else{
            setLoading(false);
            start();
        }
    }} {...others}>
        <span>{title}</span>{countdown > 0 &&  <span>({countdown})</span>}
    </Button>;
}

export type UseCountDownButtonOptions = Omit<CountDownButtonProps,'disabled'|'id'|'onClick'|'type'|'form'> & {
    form : FormInstance,
    field : string|string[],
    type : string;
    buttonType ?: CountDownButtonProps['type'],
    submit ?: (value : string,type : string)=>Promise<any>;
};
export function useCountDownButton(options : UseCountDownButtonOptions){
    const {form,field,type,submit,buttonType = 'text',...props} = options;
    const finalProps = Object.assign({
        duration:60,
        size : 'small',
    },props || {})
    const value = Form.useWatch(field,form);
    const path = _.isArray(field)?field.join('-'):field;
    const id = `${type}_${path}`;
    return <CountDownButton
            id={id}
            disabled={!value}
            type={buttonType}
            onClick={async ()=>{
                const data = await form.validateFields([field]);
                const value = _.get(data,path);
                if(submit){
                    try{
                        await submit(value, type);
                    }catch(e){
                    }
                }
            }}
            {...finalProps}
    />
}
