import dayjs from "dayjs";
import {FormItemConverter} from "./FormItemConverter";
import {FC, ReactElement} from "react";

export const DateRangeConverter :FC<{children : ReactElement}> = ({children,...others}) => {
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
            return [value?.[0]?.format('YYYY-MM-DD 00:00:00'),value?.[1]?.format('YYYY-MM-DD 23:59:59')].filter(Boolean);
        }}
    >
        {children}
    </FormItemConverter>
}
