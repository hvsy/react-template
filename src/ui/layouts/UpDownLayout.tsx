import React, { FC } from "react";
import {Layout} from "antd";
import {RouterMenu, RouterMenuItem} from "@/ui/fragments/RouterMenu";
const {Header,Content} = Layout;

export type UpDownLayoutProps = {
    theme ?: 'dark' | 'light',
    children ?: React.ReactNode;
    menus : RouterMenuItem[];
    header ?: React.ReactNode;
    onMenuClick ?: (path:string[],key:string)=>void;
    contentClassName ?: string;
    logo ?:React.ReactNode;

};
export const UpDownLayout : FC<UpDownLayoutProps> = (props) => {
    const {theme = 'light',logo,contentClassName='',children,menus,header,onMenuClick} = props;
    return <Layout>
        <Header className={`flex flex-row items-stretch p-0 h-[48px] leading-[48px] ${theme==='light' ? 'bg-white' : ''}`} style={{
            boxShadow:'0 1px 4px 0 rgb(0 21 41 / 12%)',
        }}>
            {logo}
            <RouterMenu
                theme={theme}
                mode="horizontal"
                className={'flex-1'}
                items={menus}
            ></RouterMenu>
            {header}
        </Header>
        <Content className={contentClassName}>
            {children}
        </Content>
    </Layout>
};
