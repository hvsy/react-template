import './index.global.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter,} from "react-router-dom";

import {SWRConfig} from "swr";
import {App} from "./App";
import {api} from "./lib/api";

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
            fetcher: api,
            revalidateIfStale: false,
            refreshWhenHidden: false,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            refreshWhenOffline: false,
            revalidateOnReconnect: false,
            revalidateOnMount: true,
        }}>
                <App />
        </SWRConfig>
    </BrowserRouter>
);
