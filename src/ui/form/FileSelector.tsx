import {FC, useRef} from "react";
import {Button} from "antd";
import {UploadOutlined} from "@ant-design/icons";

export type FileSelectorProps =  {
    value ?: File,
    onChange ?: (value : File)=>void;
    className?:string;
} ;

export const FileSelector : FC<FileSelectorProps> = (props)=>{
    const {value,onChange,className = ''} = props;
    const ref = useRef<HTMLInputElement>(null);
    return <div className={`${className} flex flex-row items-center space-x-2`}>
        <Button onClick={() => {
            ref.current?.click();
        }} icon={<UploadOutlined />}>
            浏览
        </Button>
        {value? <div className={'flex flex-row'}>
            <span>
                {value?.name}
            </span>
        </div>:null}
        <input onChange={(e) => {
            const file = e.target.files?.[0];
            if(file){
                onChange && onChange(file);
            }
        }} ref={ref} type="file" multiple={false} className={'hidden'}/>
    </div>;
}
