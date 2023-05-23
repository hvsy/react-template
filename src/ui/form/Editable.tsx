import {FC, useEffect, useState} from "react";
import {Input, InputNumber, Spin} from "antd";
import {EditOutlined, EnterOutlined} from "@ant-design/icons";

export type EditableProps = {
    className ?: string;
    value ?: string;
    onChange ?: (value : string)=>(Promise<void>)|void;
    type : 'text'|'number';
}

export const Editable : FC<EditableProps>= (props) => {
    const {className = '',value= '',onChange,type = 'text'} = props;
    const [editing,setEditing] = useState(false);
    const [loading,setLoading] = useState(false);
    const [currentValue,setCurrentValue] = useState(value);
    useEffect(() => {
        if(value !== currentValue){
            setCurrentValue(value);
        }
    },[value,editing]);
    let content : any = value;
    let icon : any = null;
    if(loading){
        content = <Spin spinning={true}/>
    }else if(editing){
        icon = <EnterOutlined />;
        if(type === 'text'){
            content = <Input value={currentValue} onChange={(e) => {
                setCurrentValue(e.target.value);
            }}/>
        }else if(type === 'number'){
            content = <InputNumber value={currentValue} onChange={(e) => {
                e && setCurrentValue(e);
            }}/>
        }
    }else{
        icon = <EditOutlined />;
    }
    return <div className={`flex flex-row items-center ${className}`}>
        <div>{content}</div>
        <div className={'cursor-pointer'} onClick={() => {
            if(editing){
                if(currentValue === value){
                    setEditing(false);
                    return;
                }
                if(loading) return;
                setLoading(true);
                if(!onChange){
                    setEditing(false);
                    setLoading(false);
                }else{
                    const p = onChange(currentValue);
                    if(typeof p === 'object'){
                        p.finally(() => {
                            setEditing(false);
                            setLoading(false);
                        })
                    }else{
                        setEditing(false);
                        setLoading(false)
                    }
                }

            }else{
                setEditing(true);
            }

        }}>{icon}</div>
    </div>
};
