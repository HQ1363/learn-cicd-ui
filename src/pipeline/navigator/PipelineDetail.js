/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/8/20
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/8/20
 */
import React from "react";
import PipelineAside from "./PipelineAside";
import {ClockCircleOutlined, CreditCardOutlined, ExperimentOutlined, SettingOutlined} from "@ant-design/icons";

const PipelineDetail = (props) => {

    const pipelineId = props.match.params.id;

    const pipelineRouters=[
        {
            id:`/pipeline/${pipelineId}/config`,
            to:`/pipeline/${pipelineId}/config`,
            title: "设计",
            icon: <CreditCardOutlined />,
        },
        {
            id:`/pipeline/${pipelineId}/history`,
            to:`/pipeline/${pipelineId}/history`,
            title: "历史",
            icon: <ClockCircleOutlined />,
        },
        {
            id:`/pipeline/${pipelineId}/test`,
            to:`/pipeline/${pipelineId}/test/overview`,
            title: "测试报告",
            icon: <ExperimentOutlined />,
        },
        {
            id:`/pipeline/${pipelineId}/setting`,
            to:`/pipeline/${pipelineId}/setting`,
            title: "设置",
            icon: <SettingOutlined />,
        },
    ]

    return (
        <PipelineAside
            {...props}
            pipelineRouters={pipelineRouters}
        />
    )
}

export default PipelineDetail
