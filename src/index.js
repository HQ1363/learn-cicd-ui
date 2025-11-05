import React from "react";
import ReactDOM from "react-dom";
import {enableAxios} from "tiklab-core-ui";
import {privilegeStores} from "tiklab-privilege-ui/es/store";
import {orgStores} from "tiklab-user-ui/es/store";
import {observer} from "mobx-react";
import {store} from "./store";
import routes from "./routes";
import App from "./app";
import {InitInstallProvider} from 'tiklab-eam-ui';
import {initMock} from './common/utils/InitMock';

enableAxios()

// 初始化 Mock 拦截器（开发模式下自动启用）
initMock()
const Index = observer(() => {

    const allStore = {
        ...privilegeStores,
        ...orgStores,
        ...store
    }

    return (
        <InitInstallProvider bgroup={'arbess'}>
            <App
                routes={routes}
                allStore={allStore}
            />
        </InitInstallProvider>
    )
})

ReactDOM.render(<Index/>, document.getElementById("root"))

if(module.hot){
    module.hot.accept()
}
