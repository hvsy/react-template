import {TreeBuilder} from "@/core/TreeBuilder";
import {Module} from "@/core/Module";

//@ts-ignore
const layouts= require.context('@/' + process.env.PAGES_ROOT!,true,/config\/layout.tsx$/,process.env.MODULE_MODE);
//@ts-ignore
const pages = require.context('@/' + process.env.PAGES_ROOT!,true,/pages\/([^/]+).tsx$/,process.env.MODULE_MODE);

const ModuleTreeBuilder = TreeBuilder(Module);
const pageBuilder = new ModuleTreeBuilder(/^[^/]+.tsx$/ig,/\/?pages\/|\/modules\//i,(tree, {key,path}) => {
    if(path === 'index'){
        tree.data.index = key;
    }else{
        tree.data.pages.push({
            file : key,
            path,
        })
    }
});
const AppRootModule = pageBuilder.parse(pages.keys());
const layoutBuilder = new ModuleTreeBuilder(/^layout.tsx$/ig,/\/?config\/|\/modules\//i,(tree,{key,path})=>{
    tree.data.layout = key;
});
layoutBuilder.parse(layouts.keys(),AppRootModule);

export const AppModuleConfig = {
    module : AppRootModule,
    loader : {
        layout : layouts,
        page : pages,
    }
}
