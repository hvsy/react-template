import './index.global.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter,} from "react-router-dom";

import {SWRConfig} from "swr";
import {App} from "./App";

function getRoot(){
    let root = document.getElementById('root');
    if(!root){
        root = document.createElement('div');
        root.setAttribute('id', 'root');
        document.body.appendChild(root);
    }
    return root;
    
}

function render(which : React.ReactChild){
    ReactDOM.createRoot(getRoot()).render(which);
}

render(
    <BrowserRouter>
        <SWRConfig value={{
        }}>
                <App />
        </SWRConfig>
    </BrowserRouter>
);
