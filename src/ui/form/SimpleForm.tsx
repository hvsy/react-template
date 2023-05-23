import { Form } from "antd";
import React from "react";
import {FC, ReactElement} from "react";
import {useLaravelForm} from "../../hooks/useLaravelForm";

export type SimpleFormProps = {
    callback : (values : any)=>Promise<any>;
    children : ReactElement;
    value ?: any;
};

export const SimpleForm: FC<SimpleFormProps> = (props) => {
    const {callback,value,children} = props;
    const [form,actions] = useLaravelForm(async (data) => {
        return await callback(data.value);
    });
    const child = React.cloneElement(children,{
        onChange : async (...args : any[])=>{
            children.props.onChange?.(...args);
            actions.submit();
        }
    });
    return <Form form={form} component={false} initialValues={{
        value,
    }}>
        <Form.Item name="value" noStyle={true}>
            {child}
        </Form.Item>
    </Form>
};
