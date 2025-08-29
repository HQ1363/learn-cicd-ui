/**
 * @Description: 应用入口
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React from 'react';
import {AppLink,HelpLink,AvatarLink} from "tiklab-licence-ui";
import {UserVerify} from 'tiklab-eam-ui';
import Portal from "./Portal";
import {
    ClockCircleOutlined,
    ProjectOutlined,
    SettingOutlined
} from "@ant-design/icons";

const firstRouters=[
    {
        key:"/pipeline",
        to:"/pipeline",
        title: "流水线",
        icon:<ProjectOutlined />,
    },
    {
        key:"/history",
        to:"/history",
        title:"历史",
        icon: <ClockCircleOutlined />,
    },
    {
        key:"/setting",
        to:"/setting/home",
        title:"设置",
        icon: <SettingOutlined />,
    },
]

const Layout = props =>{

    return (
        <Portal
            {...props}
            AppLink={AppLink}
            HelpLink={HelpLink}
            AvatarLink={AvatarLink}
            firstRouters={firstRouters}
        >
        </Portal>
    )
}


export default UserVerify(Layout,'/noAuth')

