import {createSmartContainer} from "@/lib/createSmartContainer";
import useMediaQuery from "use-media-antd-query";


export type GlobalConfig  ={
    isMobile : boolean;
}
export const GlobalConfigContainer = createSmartContainer(() => {
    const media = useMediaQuery();
    return {
        isMobile : media === 'xs' || media === 'sm',
    };
});

export function useGlobalConfig(){
    return GlobalConfigContainer.useContainer();
}

