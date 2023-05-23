import {FC} from "react";
import {DialogFormProps} from "./FormDialog";
import {Form, Input} from "antd";

export type SimpleTextAreaFormProps = DialogFormProps & {
    fieldName ?: string,
    fieldLabel ?: string;
};

export const SimpleTextAreaForm: FC<SimpleTextAreaFormProps> = (props) => {
    const {formProps,field,fieldName = 'value',fieldLabel = '内容'} = props;
    return <Form {...formProps}>
        <Form.Item {...field(fieldName,fieldLabel)}>
            <Input.TextArea rows={15} />
        </Form.Item>
    </Form>;
};
