import {TreeBuilder} from "@/core/TreeBuilder";
import {Module} from "@/core/Module";

const layouts= require.context('@/' + process.env.PAGES_ROOT!,true,/config\/layout.tsx$/,'lazy');
const pages = require.context('@/' + process.env.PAGES_ROOT!,true,/pages\/([^/]+).tsx$/,'lazy');


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
const layoutBuilder = new ModuleTreeBuilder(/^layout.tsx$/ig,/\/config\/|\/modules\//i,(tree,{key,path})=>{
    tree.data.layout = key;
});
layoutBuilder.parse(layouts.keys(),AppRootModule);
console.log(AppRootModule);

export const AppModuleConfig = {
    module : AppRootModule,
    loader : {
        layout : layouts,
        page : pages,
    }
}
