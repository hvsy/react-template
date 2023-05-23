import React, {FC, ReactNode} from "react";

export type PageBlockProps = {
    className ?: string;
    children ?: ReactNode;
};

export const PageBlock: FC<PageBlockProps> = (props) => {
    const {children,className} = props;
    return (<div className={`bg-white
    flex-1 flex-col flex items-stretch overflow-hidden ${className || ''}`}>
        {children}
    </div>);
};
