import {FC, useEffect, useMemo, useState} from "react";
import {Menu, MenuProps,} from "antd";
import {ItemType} from "antd/es/menu/hooks/useItems";
import {useLocation, useNavigate} from "react-router-dom";
import _ from "lodash";

export type RouterMenuItem = ItemType & {
    url?: string;
    regex?: RegExp | string;
    children ?: RouterMenuItem[],
    key ?: string;
};
export type RouterMenuProps = Omit<MenuProps, 'items'|'onClick'|'selectedKeys'> & {
    items?: RouterMenuItem[];
    onClick ?: ()=>void;
};

export const RouterMenu: FC<RouterMenuProps> = (props) => {
    const {items,onClick,...others} = props;
    const nav = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState<string>();
    const map = useMemo(() => {
        const after :any[]= [];
        function node(item : RouterMenuItem,key : string,paths : string[]){
            const path = [...paths,key].join('.');
            after.push({
                key : path,
                ...item,
            });
            item.key = path;
            (item.children||[]).forEach((child,i) => {
                node(child,i + '',[...paths,key!]);
            })
        }
        items?.forEach((item,i)=>node(item,i + '',[]));
        return after;
    },[items]);
    const pathname = location.pathname;
    useEffect(() => {
        for(let i=0;i<map.length;++i){
            const item = map[i];
            if(item.url === pathname){
                setSelected(item.key);
                break;
            }else if(item.regex && item.regex.test(pathname)){
                setSelected(item.key);
                break;
            }
        }
    }, [pathname,map]);
    return <Menu onClick={(item) => {
                    const key = item.key;
                    const hit = _.get(items,key);
                    if (hit && hit.url) {
                        nav(hit.url);
                    }
                    onClick && onClick();
                }}
                items={items}
                selectedKeys={selected ? [selected] : []}
                {...others}
    />

};
