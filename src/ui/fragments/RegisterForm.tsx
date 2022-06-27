import {Checkbox, Form, FormInstance, Input} from "antd";
import {GiftOutlined, MobileOutlined,} from "@ant-design/icons";
import {AsyncButton} from "../form/AsyncButton";
import {api} from "@/lib/api";
import {getDeviceId} from "@/lib/DeviceId";
import {Token} from "@/lib/token";
import {useNavigate} from "react-router-dom";
import {PasswordInput} from "../form/PasswordInput";
import {useLaravelForm} from "@/hooks/useLaravelForm";
import {FC, ReactNode} from "react";

export type RegisterForm = {
    children : ReactNode;
    form ?: FormInstance;
    redirect ?: string;
};
export const RegisterForm : FC<RegisterForm> = (props)=>{
    const {children,form : formInstance,redirect = '/admin/dashboard'}= props;
    const nav = useNavigate();
    const [form,laravel] = useLaravelForm(async (values)=>{
        const res = await api<string>({
            method: 'post',
            url: '/api/register',
            data: {
                ...values,
                device: {
                    uuid : getDeviceId(),
                },
            },
        });
        Token.set(res);
        nav(redirect);
    },formInstance);
    return <Form form={form} component={false} size={'large'} onFieldsChange={laravel.onFieldsChange}>
                <Form.Item rules={[{
                    required : true,
                    message : '请输入邀请码'
                }]}
                           label={'邀请码'}
                           name={'invite_code'} {...laravel.error('invite_code')}>
                    <Input addonBefore={<GiftOutlined />} placeholder={'请输入邀请码'} />
                </Form.Item>
                <Form.Item rules={[{
                    required : true,
                    message : '请输入您的手机号'
                }]}
                           label={'手机号'}
               name={'account'} {...laravel.error('account')}>
                    <Input addonBefore={<MobileOutlined />} placeholder={'请输入您的手机号码'} />
                </Form.Item>
                <Form.Item name={'password'} label={'密码'} rules={[
                    {
                        required: true,
                        message : '请输入您的密码',
                    }
                ]} {...laravel.error('password')}>
                    <PasswordInput placeholder={'请输入您的密码'} />
                </Form.Item>
                <Form.Item name={'password_confirmation'} rules={[{
                    required : true,
                    message : '请再次输入您的密码',
                },{
                    validator : laravel.confirmation('password','两次输入的密码不一致'),
                }]}
                           label={'确认密码'}
               dependencies={['password']}
                >
    
                    <PasswordInput placeholder={'请再次输入密码'}/>
                </Form.Item>
                {children}
                <Form.Item name={'agreement'} rules={[
                            {
                                required : true,
                                message : '必须同意注册协议',
                            }
                        ]} valuePropName="checked">
                    <Checkbox className="select-none"><span>同意协议</span></Checkbox>
                </Form.Item>
                <div className={'flex flex-row'}>
                    <AsyncButton className="flex-1 justify-center bg-blue-600 text-white rounded overflow-hidden px-4 py-2" onClick={laravel.submit}>
                        注册
                    </AsyncButton>
                </div>
            </Form>

}
