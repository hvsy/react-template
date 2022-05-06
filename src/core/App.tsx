import { FC } from "react";



import {ModuleRoutes} from "@/core/ModuleRoutes";
import {AppModuleConfig} from "@/core/AppModuleConfig";

export type AppProps = {};

export const App : FC<AppProps> = (props) => {
    return <ModuleRoutes path="/" {...AppModuleConfig} />
};

