import { FC } from "react";
import {Route, Routes } from "react-router-dom";

export type AppProps =  {

} ;

const Hello = () => {
    return <div className={'w-full h-full flex flex-col justify-center items-center'}>
        Hello React Template!!!
    </div>;
};

export const App : FC<AppProps> = (props)=>{
    return <Routes>
        <Route path="/" element={<Hello />} />
    </Routes>
}
