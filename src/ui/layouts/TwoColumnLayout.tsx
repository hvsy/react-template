import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Drawer, Layout, Menu} from 'antd';
import React, {FC, useEffect, useState} from 'react';
import {RouterMenu, RouterMenuItem} from "@/ui/fragments/RouterMenu";
import useAntdMediaQuery from 'use-media-antd-query';
import {useGlobalConfig} from "@/containers/GlobalConfigContainer";


const {Header, Sider, Content} = Layout;

export type TwoColumnLayoutProps = {
    logo ?:React.ReactNode;
    theme ?: 'dark' | 'light',
    children ?: React.ReactNode;
    menus : RouterMenuItem[];
    header ?: React.ReactNode;
    contentClassName ?: string;
    headerClassName ?: string;
    siderClassName ?: string;
    mainClassName ?: string;
    className ?: string;
    onMenuClick ?: (path:string[],key:string)=>void;
};

export const TwoColumnLayout: FC<TwoColumnLayoutProps> = (props) => {
    const {
        logo,theme = 'light',header : HeaderContent,children,menus,
        siderClassName = '',
        headerClassName = '',
        contentClassName = '',
        className = '',
        mainClassName = '',
        onMenuClick,
    } = props;
    const isMobile = useGlobalConfig().isMobile;
    const [collapsed, setCollapsed] = useState(isMobile);
    useEffect(() => {
        if(isMobile){
            setCollapsed(true);
        }else{
            setCollapsed(false);
        }
    },[isMobile]);
    const siderMenus = <Sider className={`flex flex-col  bg-white ${isMobile ?'w-full':siderClassName}`} trigger={null} collapsible={!isMobile} collapsed={isMobile ? false:collapsed}
                              width={isMobile ? '100%' : undefined}
                         style={{
                             boxShadow : '2px 0 8px 0 rgb(29 35 41 / 5%)',
                         }}
    >
        {logo}
        <RouterMenu
            onClick={() => {
                if(isMobile){
                    setCollapsed(true);
                }
            }}
            theme={theme}
            mode="inline"
            className={'flex-1'}
            items={menus}
        ></RouterMenu>
    </Sider>;
    return (
        <Layout className={`flex-1 items-stretch overflow-hidden ${className}`}>
            {isMobile ?<Drawer visible={!collapsed} placement="left" width={'75%'}
                               bodyStyle={{
                                   padding:0,
                               }}
                               closeIcon={null}
                               onClose={() => {
                setCollapsed(true);
            }}>
                {siderMenus}
            </Drawer>: siderMenus}
            <Layout className={`flex flex-col items-stretch flex-1 ${mainClassName}`}>
                <Header className={`flex flex-row bg-white p-0 ${headerClassName}`} style={{
                    boxShadow : '0 1px 4px rgb(0 21 41 / 8%)',
                }}>
                    <div className={''}>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'px-4 text-lg cursor-pointer hover:text-blue-500',
                            onClick: () => setCollapsed(!collapsed),
                        })}
                    </div>
                    {HeaderContent}
                </Header>
                <Content className={`bg-white min-width-[280px] ${contentClassName}`}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

