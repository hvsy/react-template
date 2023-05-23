import {FC, ReactElement, ReactNode} from "react";
import {FormItemConverter} from "@/ui/form/FormItemConverter";

export type CheckboxConverterProps = {
    children: ReactElement;
    valuePropName?:string;
};

export const CheckboxConverter: FC<CheckboxConverterProps> = (props) => {
    const {children,valuePropName = 'checked',...others} = props;
    return <FormItemConverter
        {...others}
        valuePropName={valuePropName}
        from={(value ?: string) => {
        return parseInt(value || '0') !== 0;
    }} to={(value ?: any) => {
        return value ? '1' : '0';
    }}>{children}</FormItemConverter>
};
