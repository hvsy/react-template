import {Form, FormInstance, Input} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {api} from "@/lib/api";
import {getDeviceId} from "@/lib/DeviceId";
import {Token} from "@/lib/token";
import {Link, useNavigate} from "react-router-dom";
import {AsyncButton} from "../form/AsyncButton";
import {PasswordInput} from "../form/PasswordInput";
import {useLaravelForm} from "@/hooks/useLaravelForm";
import {FC, ReactNode} from "react";

export type LoginFormProps = {
    children ?: ReactNode,
    redirect ?: string;
    form ?: FormInstance;
}
export const LoginForm  : FC<LoginFormProps> = (props)=>{
    const {children,form : formInstance,redirect = '/admin/dashboard'} = props;
    const nav = useNavigate();
    const [form,laravel] = useLaravelForm(async(values) => {
        const res = await api<string>({
            method: 'post',
            url: '/api/login',
            data: {
                ...values,
                device: {
                    uuid: getDeviceId(),
                },
            },
        });
        Token.set(res);
        nav(redirect);
    },formInstance);
    return <Form component={false} size={'large'} form={form} onFieldsChange={laravel.onFieldsChange}>
            <Form.Item label={null} name={'account'} className="rounded" rules={[
                {
                    required: true,
                    message: '账号不能为空',
                },
            ]} {...laravel.error('account')}>
                <Input addonBefore={<UserOutlined />} placeholder={'账号'} />
            </Form.Item>
            <Form.Item name={'password'} className="rounded overflow" rules={[
                {
                    required: true,
                    message: '密码不能为空',
                },
            ]}>
                <PasswordInput placeholder={'密码'}/>
            </Form.Item>
            {children}
            <div className={'flex flex-row'}>
                <AsyncButton className="flex-1 justify-center bg-blue-600 text-white rounded overflow-hidden px-4 py-2"
                             onClick={laravel.submit}>
                    登录
                </AsyncButton>
            </div>
        </Form>;
};
