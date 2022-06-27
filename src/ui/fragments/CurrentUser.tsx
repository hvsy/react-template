import {FC} from "react";
import {UserOutlined} from "@ant-design/icons";
import {Button, Dropdown, Menu} from "antd";
import {useUser} from "@/containers/AuthContainer";
import {api} from "@/lib/api";
import {useNavigate} from "react-router-dom";
import {Token} from "@/lib/token";
import {ItemType} from "antd/es/menu/hooks/useItems";

export type CurrentUserProps = {
    renderName ?: (user : User)=> React.ReactNode;
    menus ?: ItemType[];
};

export function defaultRenderUserName(user : User){
    return user.name;
}
export const CurrentUser: FC<CurrentUserProps> = (props) => {
    const {menus = [],renderName = defaultRenderUserName} = props;
    const [user,refresh] = useUser();
    const nav = useNavigate();
    return <Dropdown  overlay={<Menu
            items={[
                ...menus,
                {
                    label: '退出',
                    key : 'logout'
                }
            ]}
            onClick={(which) => {
        switch(which.key){
            case 'logout':
            {
                api({
                    method: 'post',
                    url: "/api/admin/logout",
                }).then(() => {
                    Token.remove();
                    refresh(null);
                    nav('/login');
                });
            }
            break;
        }
    }} />
    }>
        <Button type="text" className="cursor-pointer" size={'small'} icon={<UserOutlined />}>
            {renderName(user)}
        </Button>
    </Dropdown>;
}
