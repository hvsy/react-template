import { FormInstance} from 'rc-field-form';
import { RuleObject } from "antd/lib/form";
import { StoreValue } from "antd/lib/form/interface";

export const CustomValidator = {
    confirmed(field: string,error : string){
        return (form : FormInstance) => ({
            validator(_  : RuleObject, value : StoreValue) {
                if (!value || form.getFieldValue(field) === value) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error(error));
            },
        })
    }
};
