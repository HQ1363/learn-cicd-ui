/**
 * @Description: 任务详情
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/11
 */
import React, {useEffect,useState} from "react";
import {Skeleton} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {inject,observer} from "mobx-react";
import Button from "../../../../../common/component/button/Button";
import PipelineDrawer from "../../../../../common/component/drawer/Drawer";
import Tabs from "../../../../../common/component/tabs/Tabs";
import BasicInfo from "./basicInfo/BasicInfo";
import TaskDetailsSet from "./TaskDetailsSet";
import {HeadlineTitle} from "./TaskCommon";
import "./TaskDetails.scss";

const TaskDetails = props =>{

    const {taskFormDrawer,setTaskFormDrawer,taskStore} = props

    const {dataItem,findOneTasksOrTask} = taskStore;

    //加载状态
    const [loading,setLoading] = useState(false);
    //标签
    const [handleType,setHandleType] = useState("base");

    useEffect(() => {
        if(taskFormDrawer && dataItem?.formType==="task"){
            setLoading(true)
            findOneTasksOrTask(dataItem.taskId).then(()=>{
            }).finally(()=>setLoading(false))
        }
    }, [taskFormDrawer]);

    /**
     * task类型
     * @param item
     */
    const changHandleType = item =>{
        setHandleType(item.id)
    }

    /**
     * 关闭弹出框
     */
    const onClose = () =>{
        setTaskFormDrawer(false);
        setHandleType("base");
    }

    return(
        <PipelineDrawer
            visible={taskFormDrawer}
            onClose={onClose}
            width={520}
            mask={true}
            className="task-details"
        >
            <div className="task-details-up">
                <div className="wrapper-head-title">{HeadlineTitle(dataItem?.taskType)}</div>
                <Button onClick={onClose} title={<CloseOutlined />} type="text"/>
            </div>
            <div className="task-details-bottom">
                <div className="body-taskForm">
                    {
                        dataItem?.formType==='task' &&
                        <Tabs
                            tabLis={
                                [
                                    {id:"base", title: "基本信息"},
                                    {id:"high", title: "高级设置"},
                                ]
                            }
                            type={handleType}
                            onClick={changHandleType}
                        />
                    }
                    {
                        handleType === 'base' &&
                        <Skeleton loading={loading}>
                            <BasicInfo {...props}/>
                        </Skeleton>
                    }
                    {
                        handleType === 'high' &&
                        <TaskDetailsSet
                            {...props}
                            dataItem={dataItem}
                        />
                    }
                </div>
            </div>
        </PipelineDrawer>
    )
}

export default inject("taskStore","stageStore")(observer(TaskDetails))

