import {FC, ReactElement} from "react";
import {FormItemConverter} from "@/ui/form/FormItemConverter";
import dayjs from "dayjs";

export type DatePickerConverterProps = CustomFormField & {
    children: ReactElement
    //日期格式默认是: YYYY-MM-DD 比如 : 2023-03-15
    format ?: string;
}

export const DatePickerConverter: FC<DatePickerConverterProps> = (props) => {
    const {children,format = 'YYYY-MM-DD', ...others} = props;
    return <FormItemConverter
        {...others}
        from={(value ?: any) => {
            return value ? dayjs(value) : null;
        }} to={(value ?: any) => {
        return value?.format(format) || null;
    }}>
        {children}
    </FormItemConverter>
};
