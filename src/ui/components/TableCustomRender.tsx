import dayjs from "dayjs";
import {Button, Tag, Tooltip, Typography} from "antd";
import {Editable} from "@/ui/form/Editable";
import {Switcher} from "@/ui/form/Switcher";
import {Link} from "react-router-dom";
import {ReactNode} from "react";
import Color from "color";
import _ from "lodash";

export const ColumnRenderDefaultOptions: any = {
    ellipsis: {
        ellipsis: {
            showTitle: true,
        }
    }
};
export const ColumnRender = {
    date(defaultValue  = "",format = 'YYYY-MM-DD HH:mm:ss') {
        return (at: string) => {
            if (!at) return defaultValue;
            return <span className={'whitespace-nowrap'}>{dayjs(at).format(format)}</span>;
        }
    },
    copyable(defaultValue : ReactNode= '') {
        return (content: string) => {
            if (!content) return defaultValue;
            return <Typography.Paragraph copyable>
                {content}
            </Typography.Paragraph>
        }
    },
    price(prefix: (string|((data : any)=>string)) = '',defaultValue  = "",digits : number = 2) {
        return (content: number|string,item ?: any) => {
            if(content === undefined || content === null) return defaultValue;
            return <span>{_.isFunction(prefix) ? prefix(item) : prefix}{parseFloat((content || 0)+'').toFixed(digits)}</span>
        }
    },
    editable(type: 'number' | 'text', callback: (value: any, item: any) => Promise<void>) {
        return (value: any, item: any) => {
            return <Editable type={type} value={value} onChange={(value) => callback(value, item)}/>
        }
    },
    switcher(callback: (checked: boolean, item: any) => Promise<void>) {
        return (value: any, item: any) => {
            return <Switcher onChange={(checked) => {
                return callback(checked, item);
            }} value={!!value}/>
        }
    },
    ellipsis(max : number = 255) {
        return (content: any) => {
            if(!content) return <div>-</div>;
            return <Tooltip placement="topLeft" title={content}>
                {_.isString(content) ? content.substring(0,max) + (content.length > max ? '...' : ''): content}
            </Tooltip>
        }
    },
    enums<T = any>(map : T,colors ?: Partial<T>,defaultValue  =''){
        return (content : keyof T)=>{
            const color = colors?.[content] as unknown as string;
            let textColor = undefined;
            if(color && color.charAt(0) === '#'){
                textColor = Color(color).isLight() ? 'black' : 'white';
            }
            // @ts-ignore
            return <Tag color={color} style={{
                color:textColor,
            }}>{(map[content] as unknown as string || defaultValue)}</Tag>
        }
    },
    render(callback : (data : any)=>ReactNode){
        return (id : any,item : any)=>{
            return callback(item);
        }
    },
    json(defaultValue = '-'){
        return (content : any)=>{
            if(!content) {
                return defaultValue;
            }
            return <div>
                {JSON.stringify(content,null,4)}
            </div>
        }
    },
    text(empty : string = '-',suffix = '') {
        return (content: any) => {
            return <div>{(content === undefined || content === null) ?  empty : content}{suffix}</div>
        }
    },
    link(name: Function|string = '') {
        return (content: string, item: any) => {
            if (!content) return '-';
            const title = _.isFunction(name)?name(item) : name;
            return <div>
                {content.indexOf('http') === -1 ? <Link to={content}>
                    <Button type="link">{title || '链接'}</Button>
                </Link> : <Button type="link" href={content} target="_blank">
                    {title || '链接'}
                </Button>}
            </div>
        }
    },
    boolean(labels: string[] = ['否', '是']) {
        return (content: any) => {
            const label = labels[content ? 1 : 0];
            return <div>{label || '-'}</div>
        }
    },
    percent(empty : string = ''){
        return (content : any) => {
            if(content === null || content === undefined) return empty;
            return <div>{parseFloat(content).toFixed(2)}%</div>
        }
    }
};
