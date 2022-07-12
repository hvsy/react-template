import dayjs from "dayjs";
import {Tooltip, Typography} from "antd";
import {Editable} from "@/ui/form/Editable";
import {Switcher} from "@/ui/form/Switcher";

export const ColumnRenderDefaultOptions : any = {
    ellipsis :{
        ellipsis:{
            showTitle : true,
        }
    }
};
export const ColumnRender = {
    date(at : string){
        if(!at) return "";
        return <span className={'whitespace-nowrap'}>{dayjs(at).format('YYYY-MM-DD HH:mm:ss')}</span>;
    },
    copyable(content : string){
        if(!content) return "";
        return <Typography.Paragraph copyable>
            {content}
        </Typography.Paragraph>
    },
    price(prefix : string){
        return (content : number)=>{
            return <span>{prefix}{(content||0).toFixed(2)}</span>
        }
    },
    editable(type : 'number'|'text',callback : (value : any,item : any)=>Promise<void>){
        return (value : any,item : any) => {
            return <Editable type={type} value={value} onChange={(value)=>callback(value,item)}/>
        }
    },
    switcher(callback : (checked : boolean,item : any)=>Promise<void>){
        return (value : any,item : any) => {
            return <Switcher onChange={(checked) => {
                return callback(checked,item);
            }} value={!!value}/>
        }
    },
    ellipsis(content : any){
        return <Tooltip placement="topLeft" title={content}>
            {content}
        </Tooltip>
    },
    text(content:any){
        return <div>{content}</div>
    }
};
