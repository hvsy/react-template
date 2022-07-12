import {FC, ReactNode, useState} from "react";
import {Button, Form, Modal} from "antd";
import {useLaravelForm} from "@/hooks/useLaravelForm";
import {useGlobalConfig} from "@/containers/GlobalConfigContainer";
import {FilterOutlined} from "@ant-design/icons";

export type TableSearchFormProps = {
    children?: ReactNode;
    className?: string;
    onSubmit: (values: any) => Promise<void>;
    type?: 'grid' | 'flex';
    touched?: boolean;
};

export const TableSearchForm: FC<TableSearchFormProps> = (props) => {
    const {children, touched = false, type = 'grid', className = '', onSubmit} = props;
    const finalClassName = `px-4 py-4 ${type} grid-cols-4 sm:grid-cols-1 gap-4 form-0-margin ${className}`;
    const [show, setShow] = useState(false);
    const isMobile = useGlobalConfig().isMobile;
    const [form, laravel] = useLaravelForm(onSubmit);
    const content = <Form form={form}
                          layout={isMobile ? "vertical" : 'horizontal'}
                          className={`ant-form ${isMobile ? 'ant-form-vertical overflow-y-auto' : finalClassName} `}
                          onFieldsChange={laravel.onFieldsChange}>
        {children}
        {!isMobile && <div className={'flex flex-row space-x-2'}>
            <Button type="default" onClick={() => {
                laravel.reset();
                laravel.submit();
            }}>
                重置
            </Button>
            <Button onClick={laravel.submit} type="primary">
                搜索
            </Button>
        </div>}
    </Form>;
    return isMobile ? <div className={`flex flex-col ${finalClassName}`}>
        <div className={'flex flex-row justify-between'}>
            <div>
                搜索
            </div>
            <div>
                <FilterOutlined className={`${touched ? 'text-sky-600' : ''}`} onClick={() => {
                    setShow(!show);
                }}/>
            </div>
        </div>
        <Modal visible={show} onCancel={() => {
            laravel.reset();
            laravel.submit();
            setShow(false);
        }}
               cancelText={'重置'}
               okText={'搜索'}
               onOk={() => {
                   laravel.submit();
                   setShow(false);
               }}>
            {content}
        </Modal>
    </div> : content;
};
