import React, {FC, ReactElement, ReactNode} from "react";

export type TablePageContainerProps = {
    children?: any;
    className ?: string;
};

export const PageContainer: FC<TablePageContainerProps> = (props) => {
    const {children,className} = props;
    return ( <div className={`m-4 flex-1 overflow-hidden flex flex-col ${className||''}`}>
        {children}
    </div>);
};
