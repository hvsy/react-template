import {ReactElement, } from "react";
import _ from "lodash";
import {ColumnRender, ColumnRenderDefaultOptions} from "./TableCustomRender";


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
    const {title,dataIndex,type} = options;
    let customTitle = _.isArray(title) ? (title.map((t,i)=><div key={i}>{t}</div>)):title;
    return {
        title : customTitle,
        dataIndex,
        // @ts-ignore
        render : (args.length > 0 ? (ColumnRender[type])(...args) : ColumnRender[type]) as (t : string)=>ReactElement,
        ...(ColumnRenderDefaultOptions[type]||{}),
    }
}

export type CustomRenderColumns = {
    [key in CustomColumnType]: (dataIndex: string | string[], title: string | string[] | ReactElement, ...args: CustomRenderParameters<key>) => ReturnType<typeof customColumn>;
};

export type CustomColumns = CustomRenderColumns & {
    options : (options : any)=>CustomRenderColumns;
};

//@ts-ignore
export const CustomColumn : CustomRenderColumns = {

};
Object.keys(ColumnRender).forEach((key) => {
  CustomColumn[key as CustomColumnType] = (dataIndex : string|string[],title : string|string[]|ReactElement,...args : any[])=>{
      //@ts-ignore
      return customColumn({title,dataIndex,type:key},...args);
  }
});
