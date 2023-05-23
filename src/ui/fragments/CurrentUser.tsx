import {FC} from "react";
import {UserOutlined} from "@ant-design/icons";
import {Button, Dropdown,} from "antd";
import {useUser} from "@/containers/AuthContainer";
import {api} from "@/lib/api";
import {useNavigate} from "react-router-dom";
import {ItemType} from "antd/es/menu/hooks/useItems";
import {useLogout} from "@/ui/hooks/useLogout";
import {AsyncButton} from "@/ui/form/AsyncButton";

export type CurrentUserProps = {
    renderName?: (user: User) => React.ReactNode;
    menus?: ItemType[];
};

export function defaultRenderUserName(user: User) {
    return user.name;
}

export const CurrentUser: FC<CurrentUserProps> = (props) => {
    const {menus = [], renderName = defaultRenderUserName} = props;
    const [user, refresh] = useUser();
    const nav = useNavigate();
    const logout = useLogout();
    return <div className={'flex flex-row items-center'}>
        {user.faker && <div>
            <AsyncButton type="link" onClick={async ()=>{
                await api({
                    method: 'delete',
                    url: '/api/admin/fake',
                }).then(() => {
                    window.location.replace('/admin/dashboard');
                });
            }}>
                切换回: {user.faker.name}
            </AsyncButton>
        </div>}
        <Dropdown menu={{
            items : [
                ...menus,
                {
                    "label": "修改密码",
                    key: 'change-password'
                },
                {
                    label: '退出',
                    key: 'logout'
                }
            ].filter(Boolean),
            onClick : (which : any) => {
                switch (which.key) {
                    case 'change-password': {
                        nav("/admin/change-password");
                    }
                        break;
                    case 'logout': {
                        logout();
                    }
                        break;
                }
            }
        }}
        >
            <Button type="text" className="cursor-pointer" size={'small'} icon={<UserOutlined/>}>
                {renderName(user)}
            </Button>
        </Dropdown>
    </div>;
};
