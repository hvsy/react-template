import React, { FC } from "react";
import {Route, Routes} from "react-router-dom";
import {Loadable} from "./Loadable";
import {Module} from "./Module";
import {Tree} from "./Tree";

export type ModuleLoader = {
    layout : Function,
    page : Function,
}
export type ModuleRoutesProps =  {
    module : Tree<Module>;
    path : string;
    loader : ModuleLoader,
} ;


function renderModule(module : Tree<Module>,path: string,loader : ModuleLoader){
    const {data : {pages,layout,index},children,} = module;
    return <Route path={path} key={path} element={layout ? <Loadable callback={()=>loader.layout(layout)}/> : undefined}>
        {index && <Route key={'index'} index element={<Loadable callback={()=>loader.page(index)}/>} />}
        {(children).map((child) => {
            return (renderModule(child,child.key+ '/',loader));
        })}
        {pages.map(({path : pagePath,file}) => {
            return (<Route key={pagePath} path={pagePath.replace('.','/')} element={<Loadable callback={()=>loader.page(file)} />}  />);
        })}
    </Route>;
}
function renderModuleSync(module : Tree<Module>,path: string,loader : ModuleLoader){
    const {data : {pages,layout,index},children,} = module;
    const Layout = layout ? loader.layout(layout).default : undefined;
    const IndexComponent = index ? loader.page(index).default : null;
    return <Route path={path} key={path} element={Layout ? <Layout/> : undefined}>
        {IndexComponent && <Route key={'index'} index element={<IndexComponent />} />}
        {(children).map((child) => {
            return (renderModuleSync(child,child.key+ '/',loader));
        })}
        {pages.map(({path : pagePath,file}) => {
            const Component= loader.page(file).default;
            return (<Route key={pagePath} path={pagePath.replace('.','/')} element={<Component />}/>);
        })}
    </Route>;
}

const isLazy = process.env.MODULE_MODE === 'lazy';
export const ModuleRoutes : FC<ModuleRoutesProps> = (props)=>{
    const {module,path,loader} = props;
    return <Routes>
        {isLazy ?  renderModule(module,path,loader) : renderModuleSync(module,path,loader)}
    </Routes>;
};
