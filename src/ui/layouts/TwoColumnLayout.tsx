import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Layout, Menu} from 'antd';
import React, {FC, useState} from 'react';
import {ItemType} from "antd/es/menu/hooks/useItems";

const {Header, Sider, Content} = Layout;

export type TwoColumnLayoutProps = {
    logo ?:React.ReactNode;
    theme ?: 'dark' | 'light',
    children ?: React.ReactNode;
    menus : ItemType[];
    header ?: React.ReactNode;
};

export const TwoColumnLayout: FC<TwoColumnLayoutProps> = (props) => {
    const {logo,theme = 'light',header : HeaderContent,children,menus} = props;
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Layout>
            <Sider className={'flex flex-col'} trigger={null} collapsible collapsed={collapsed}>
                {logo}
                <Menu
                    theme={theme}
                    mode="inline"
                    className={'flex-1'}
                    items={menus}
                    ></Menu>
            </Sider>
            <Layout className="">
                <Header className="flex flex-row bg-white p-0">
                    <div className={''}>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'px-4 text-lg cursor-pointer hover:text-blue-500',
                            onClick: () => setCollapsed(!collapsed),
                        })}
                    </div>
                    {HeaderContent}
                </Header>
                <Content className="bg-white site-layout-background mx-4 my-4 p-4 min-width-[280px]">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};
