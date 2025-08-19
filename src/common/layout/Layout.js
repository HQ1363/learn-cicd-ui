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
import SettingAside from "./SettingAside";
import Portal from "./Portal";
import {
    CarryOutOutlined,
    ClockCircleOutlined, CreditCardOutlined, ExperimentOutlined,
    ProjectOutlined,
    RadarChartOutlined,
    SettingOutlined
} from "@ant-design/icons";
import {useRouteMatch} from "react-router-dom";

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

    const match = useRouteMatch("/pipeline/:id");
    //流水线id
    const id = match?.params.id;

    const pipelineRouters=[
        {
            id:`/pipeline/${id}/config`,
            to:`/pipeline/${id}/config`,
            title: "设计",
            icon: <CreditCardOutlined />,
        },
        {
            id:`/pipeline/${id}/history`,
            to:`/pipeline/${id}/history`,
            title: "历史",
            icon: <ClockCircleOutlined />,
        },
        {
            id:`/pipeline/${id}/test`,
            to:`/pipeline/${id}/test/overview`,
            title: "测试报告",
            icon: <ExperimentOutlined />,
        },
        {
            id:`/pipeline/${id}/setting`,
            to:`/pipeline/${id}/setting`,
            title: "设置",
            icon: <SettingOutlined />,
        },
    ]

    return (
        <Portal
            {...props}
            AppLink={AppLink}
            HelpLink={HelpLink}
            AvatarLink={AvatarLink}
            firstRouters={firstRouters}
            pipelineRouters={pipelineRouters}
        >
            <SettingAside {...props} />
        </Portal>
    )
}


export default UserVerify(Layout,'/noAuth')

