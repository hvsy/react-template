import {Form, FormInstance, Input} from "antd";
import {MobileOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {AsyncButton} from "../../form/AsyncButton";
import {useLaravelForm} from "@/hooks/useLaravelForm";
import {PasswordInput} from "../../form/PasswordInput";
import {api} from "@/lib/api";
import {FC, ReactNode} from "react";

export type ForgotPasswordFormProps = {
    children : ReactNode;
    form ?: FormInstance;
    redirect ?: string;
};
export const ForgotPasswordForm : FC<ForgotPasswordFormProps> = (props)=>{
    const {children,form : formInstance,redirect = '/login'} = props;
    const nav = useNavigate();
    const [form,laravel] = useLaravelForm(async (values)=>{
        await api({
            method : 'post',
            url : '/api/forgot-password',
            data : values,
        });
        nav(redirect);
    },formInstance);
    
    return <Form component={false} form={form} size={'large'}>
            <Form.Item name={'account'} rules={[
                {
                    required : true,
                    message : '必须填写注册时候的手机号',
                }
            ]} {...laravel.error('account')}>
                <Input addonBefore={<MobileOutlined />} placeholder={'请输入您的手机号'} />
            </Form.Item>
            {children}
            <Form.Item name={'password'} rules={[
                {
                    required : true,
                    message : '必须输入密码'
                }
            ]} {...laravel.error('password')}>
                <PasswordInput placeholder={'请输入新的密码'} />
            </Form.Item>
            <Form.Item name={'password_confirmation'} rules={[{
                required : true,
                message : '必须再次输入密码'
            },{
                validator : laravel.confirmation('password','两次输入的密码不一致'),
            }]} dependencies={['password']}>
                <PasswordInput placeholder={'请再次输入新的密码'} />
            </Form.Item>
            <div>
                <AsyncButton className="flex-1 justify-center bg-blue-600 text-white rounded overflow-hidden px-4 py-2" onClick={laravel.submit}>
                    重置密码
                </AsyncButton>
            </div>
        </Form>
     
}
