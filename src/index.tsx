import './index.global.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter,} from "react-router-dom";
import {SWRConfig} from "swr";
import {App} from "./core/App";
import {api} from "./lib/api";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn'
import {ConfigProvider} from "antd";

dayjs.locale('zh-cn')

function getRoot() {
    let root = document.getElementById('root');
    if (!root) {
        root = document.createElement('div');
        root.setAttribute('id', 'root');
        document.body.appendChild(root);
    }
    return root;

}

function render(which: React.ReactChild) {
    ReactDOM.createRoot(getRoot()).render(which);
}
import zhCN from 'antd/lib/locale/zh_CN';
import {GlobalConfigContainer} from "@/containers/GlobalConfigContainer";
function main() {
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
                <ConfigProvider locale={zhCN}>
                    <GlobalConfigContainer.Provider >
                        <App/>
                    </GlobalConfigContainer.Provider>
                </ConfigProvider>
            </SWRConfig>
        </BrowserRouter>
    );
}

if (process.env.NODE_ENV === 'development') {
    import('./mocks/browser').then((m) => {
         m.worker.start();
         main();
    });
    main();
} else {
    main();
}
