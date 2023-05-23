import React from "react";
import {FC} from "react";

export type MultiColumnPageProps = {
    children : any;
    columns ?: (number|string)[];
    className ?: string;
};

export const MultiColumnPage: FC<MultiColumnPageProps> = (props) => {
    const {children,columns,className= ''} = props;
    return <div className={`flex flex-row items-stretch overflow-hidden ${className}`}>
        {
            React.Children.toArray(children).map((child,i) => {
                const col = columns === undefined ? 'flex-1' :  columns[i];
                const flex = col === undefined ? 'flex-none' : col;
                return <div className={`flex ${flex} flex-col items-stretch overflow-hidden`} key={i}>
                    {child}
                </div>
            })
        }
    </div>

};
