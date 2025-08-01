/**
 * @Description: 主机策略
 * @Author: gaomengyuan
 * @Date: 2025/7/29
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/7/29
 */
import React from "react";
import FormsMirror from "../FormsMirror";
import {observer} from "mobx-react";
import FormsSelect from "../FormsSelect";
import {Select} from "antd";
import ToolCheckpoint from "../tool/ToolCheckpoint";

const HostStrategy = (props) => {

    const {taskStore} = props;

    const {updateTask,dataItem} = taskStore;

    /**
     * 切换处理方式
     */
    const changStrategyType = (value,type) => {
        updateTask({[type]:value})
    }

    return (
        <>
            <FormsSelect
                name={"strategyType"}
                label="处理方式"
                onChange={value=>changStrategyType(value,'strategyType')}
            >
                <Select.Option value={1}>脚本处理</Select.Option>
                <Select.Option value={2}>人工处理</Select.Option>
            </FormsSelect>
            {
                dataItem.task?.strategyType===1 ?
                    <>
                        <FormsSelect
                            name={"orderType"}
                            label="脚本类型"
                            onChange={value=>changStrategyType(value,'orderType')}
                        >
                            <Select.Option value={1}>bash</Select.Option>
                            <Select.Option value={2}>cmd</Select.Option>
                        </FormsSelect>
                        <FormsMirror
                            name={"order"}
                            label={"执行命令"}
                            placeholder={"执行命令"}
                            language={dataItem.task?.orderType === 1 ? 'shell' : 'powershell'}
                        />
                    </>
                    :
                    <ToolCheckpoint
                        {...props}
                    />
            }
        </>
    )
}

export default observer(HostStrategy)


