import dayjs from "dayjs";
import {FormItemConverter} from "./FormItemConverter";
import {FC, ReactElement} from "react";

const onlyDate = ['YYYY-MM-DD 00:00:00','YYYY-MM-DD 23:59:59'];
const withTime = ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'];
export type DateRangeConverter = CustomFormField & {
    children : ReactElement,showTime ?: boolean
}
export const DateRangeConverter :FC<DateRangeConverter> = ({children,showTime = false,...others}) => {
    return <FormItemConverter
        {...others}
        from={(value ?: string[]) => {
            if (value === undefined || value === null) return undefined;
            if (value.length === 0) return undefined;
            return (value || []).map((item) => {
                return dayjs(item);
            })
        }}
        to={(value ?: any[]) => {
            if (value === undefined || value === null) return undefined;
            if (value.length === 0) return undefined;
            const [from,to] = showTime ? withTime : onlyDate;
            return [value?.[0]?.format(from),value?.[1]?.format(to)].filter(Boolean);
        }}
    >
        {children}
    </FormItemConverter>
}
