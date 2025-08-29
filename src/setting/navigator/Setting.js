/**
 * @Description: 系统设置入口
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React from "react";
import SettingAside from "../../common/component/aside/SettingAside";
import {
    CreditCardOutlined,
    DeploymentUnitOutlined,
    LayoutOutlined,
    MacCommandOutlined,
    SafetyCertificateOutlined,
    ScheduleOutlined,
    SoundOutlined,
    TeamOutlined
} from "@ant-design/icons";

const applicationRouters =  [
    {
        id: "user",
        title: "用户",
        icon: <TeamOutlined/>,
        children: [
            {
                id: "/setting/user",
                title: "用户",
                purviewCode: "user",
                isUnify:"/setting/user",
            },
            {
                id: "/setting/orga",
                title: "部门",
                purviewCode: "orga",
                isUnify:"/setting/orga",
            },
            {
                id: "/setting/userGroup",
                title: "用户组",
                purviewCode: "user_group",
                isUnify:"/setting/userGroup",
            },
            {
                id: "/setting/dir",
                title: "用户目录",
                purviewCode: "user_dir",
                isUnify:"/setting/dir",
            },
        ]
    },
    {
        id:"/setting/role",
        title:"权限",
        purviewCode:"permission",
        icon: <ScheduleOutlined />,
    },
    {
        id:"/setting/message",
        title: "消息",
        purviewCode:"message",
        icon: <SoundOutlined/>,
    },
    {
        id: "configure",
        title:"流水线配置",
        icon: <DeploymentUnitOutlined />,
        children:[
            {
                id:"/setting/grouping",
                title:"应用",
                purviewCode:"pipeline_application",
            },
            {
                id:"/setting/env",
                title:"环境",
                purviewCode:"pipeline_environment",
            },
            {
                id:"/setting/variable",
                title:"变量",
                purviewCode:"pipeline_variable",
            },
            {
                id:"/setting/agent",
                title:"Agent",
                purviewCode:"pipeline_agent",
            },
        ]
    },
    {
        id: "resource",
        title:"资源配置",
        icon: <CreditCardOutlined />,
        children: [
            {
                id:"/setting/host",
                title:"主机",
                purviewCode:"pipeline_host",
            },
            {
                id:"/setting/hostGroup",
                title:"主机组",
                purviewCode:"pipeline_host_group",
            },
            {
                id:"/setting/k8s",
                title:"Kubernetes集群",
                purviewCode:"pipeline_kubernetes_cluster",
            },
        ]
    },
    {
        id:"integration",
        title:"集成开放",
        icon: <MacCommandOutlined />,
        children: [
            {
                id:"/setting/tool",
                title:"工具集成",
                purviewCode:"pipeline_tool_integration",
            },
            {
                id:"/setting/server",
                title:"服务集成",
                purviewCode:"pipeline_service_integration",
            },
            {
                id:"/setting/openApi",
                title: "OpenApi",
                purviewCode:"openapi",
            },
        ]
    },
    {
        id:"security",
        title:"安全",
        icon:<SafetyCertificateOutlined />,
        children: [
            {
                id:"/setting/backups",
                title:"备份与恢复",
                purviewCode:"backups_and_recover",
            },
            {
                id:"/setting/myLog",
                title:"操作日志",
                purviewCode:'log',
            },
        ]
    },
    {
        id:"licence",
        title:"系统",
        icon:<LayoutOutlined />,
        children: [
            {
                id:'/setting/version',
                title: '版本与许可证',
                purviewCode:'licence',
            },
            {
                id:'/setting/productAuth',
                title: '系统访问权限',
                purviewCode:'apply_limits',
            },
            {
                id:"/setting/resources",
                title:"资源监控",
                purviewCode:"pipeline_resource_monitor",
            },
        ]
    },
]

const Setting = props =>{

    return (
        <SettingAside
            {...props}
            applicationRouters={applicationRouters}
        >
        </SettingAside>
    )

}

export default Setting
