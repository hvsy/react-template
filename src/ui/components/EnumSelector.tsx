import {Select} from "antd";
import {FC} from "react";

export type EnumSelectorProps = CustomFormField & {
        data : any;
}
export const EnumSelector : FC<EnumSelectorProps> = (props) => {
    const {data,...others} = props;
    return <Select allowClear {...others} >
        {Object.keys(data).map((key : string) => {
            return <Select.Option key={key} value={key}>
                {data[key]}
            </Select.Option>
        })}
    </Select>
};
