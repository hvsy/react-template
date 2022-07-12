import {Form, FormInstance, FormItemProps} from "antd";
import { NamePath } from "antd/es/form/interface";
import {createContext, FC, ReactNode, useContext} from "react";

export const FormContent= ({value} : {value?:string}) => {
    return <span>{(typeof value === 'undefined' || value === null) ? '-' : value}</span>;
}

export type EditableFormItemProps = FormItemProps &{
    editing ?: boolean;
    text_field ?: FormItemProps['name'],
    render ?: (value : any,form :FormInstance) => ReactNode;
};

export const FormEditableContext = createContext({
    editing : false,
});

export const EditableFormItem : FC<EditableFormItemProps> = (props) => {
    const {editing,children,render,text_field,name,...others} = props;
    const ctx = useContext(FormEditableContext);
    const ing = typeof editing === 'undefined' ? ctx.editing : editing;
    let content : any = children;
    if(!ing){
        if(render){
            content = (form : FormInstance) => {
                const path = text_field || name;
                if(path){
                    return render(form.getFieldValue(path!),form);
                }else{
                    render(null,form);
                }
            };
        }else{
            content = <FormContent />;
        }
    }
    return <Form.Item {...others} name={ing ? name : (render ? undefined : (text_field||name))}
                      dependencies={(!ing && render) ? [(text_field||name)!]: undefined}
    >
        {content}
    </Form.Item>
};
