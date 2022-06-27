import {FC, useState} from "react";
import {Input, InputProps} from "antd";
import {EyeInvisibleOutlined, EyeOutlined, LockOutlined} from "@ant-design/icons";

export type PasswordInputProps =  InputProps & {
    value ?: any;
    onChange ?: (value : any)=>void;
} ;

export const PasswordInput : FC<PasswordInputProps> = (props)=>{
    const {value,onChange,...others} = props;
    const [type,setType] = useState<string>('password');
    const switcher = <span onClick={() => {
        setType(type ==='password' ? 'text' : 'password')
    }}>
        {type==='password' ? <EyeOutlined /> : <EyeInvisibleOutlined/>}
    </span>
    return <Input addonBefore={<LockOutlined />}
                  type={type}
                  addonAfter={switcher}
                  value={value}
                  onChange={onChange}
                  {...others}
                  
    />
}
