import {ReactElement, } from "react";
import _ from "lodash";
import {ColumnRender, ColumnRenderDefaultOptions} from "./TableCustomRender";
import {TableColumnProps} from "antd";


export type CustomColumnType = keyof typeof ColumnRender;
export type CustomColumnRender<T extends CustomColumnType> = (typeof ColumnRender)[T];
type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never
type CustomRenderReturnType<T extends CustomColumnType> = ReturnType<CustomColumnRender<T>>;
export type CustomRenderParameters<T extends CustomColumnType> =CustomRenderReturnType<T> extends Function ? Parameters<CustomColumnRender<T>> :DropFirst<Parameters<CustomColumnRender<T>>>;

export type CustomColumnOptions<T extends CustomColumnType> = {
    title : string | (string[]) | ReactElement,
    dataIndex : string|string[];
    type : T,
};
export function customColumn<T extends CustomColumnType>(options : CustomColumnOptions<T>,...args : CustomRenderParameters<T> ){
    const {title,dataIndex,type,...others} = options;
    let customTitle = _.isArray(title) ? (title.map((t,i)=><div key={i}>{t}</div>)):title;
    let defaultOptions = ColumnRenderDefaultOptions[type]||{};
    return {
        ...others,
        title : customTitle,
        dataIndex,
        // @ts-ignore
        render : (ColumnRender[type])(...args) as (t : string)=>ReactElement,
        ...(_.isFunction(defaultOptions) ? defaultOptions() : defaultOptions),
    }
}

export type CustomRenderColumns<T = any> = {
    [key in CustomColumnType]: (dataIndex: string | string[], title: string | string[] | ReactElement, ...args: CustomRenderParameters<key>) => ReturnType<typeof customColumn>;
};

export type CustomColumns = CustomRenderColumns & {
    options : (options : any)=>CustomRenderColumns;
};

class ColumnHelper{
    _options : TableColumnProps<any> = {};
    constructor() {
        Object.keys(ColumnRender).forEach((key) => {
            // @ts-ignore
            this[key as CustomColumnType] =function(dataIndex : string|string[],title : string|string[]|ReactElement,...args : any[]){
                //@ts-ignore
                return customColumn({title,dataIndex,type:key,...this._options},...args);
            }
        });
    }
    width(width : string|number){
        this._options.width = width;
        return this;
    }
    sort(){
        this._options.sorter =  true;
        // this.options.sortDirections = ['asc', 'desc'];
        return this;
    }
    className(name : string){
        this._options.className = name;
        return this;
    }

}

//@ts-ignore
export const CustomColumn : ColumnHelper & CustomRenderColumns = {};

const keys = Object.getOwnPropertyNames(ColumnHelper.prototype);
[...keys,...Object.keys(ColumnRender)].forEach((method : string) => {
    if(["constructor"].indexOf(method) !== -1) return;
    //@ts-ignore
    CustomColumn[method] = function(...args : any[]){
        //@ts-ignore
        return (new ColumnHelper())[method](...args);
    }
});

