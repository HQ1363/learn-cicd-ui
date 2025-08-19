/**
 * @Description: 添加任务
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/11
 */
import React,{useState,useRef} from "react";
import {Col, Row, Modal} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {inject,observer} from "mobx-react";
import PipelineDrawer from "../../../../../common/component/drawer/Drawer";
import {taskTitle, TaskIcon} from "./TaskCommon";
import {
    git,
    gitee,
    gitlab,
    github,
    svn,
    gitpuk,
    pri_gitlab,
    sonar,
    testhubo,
    mvn,
    nodejs,
    build_docker,
    docker,
    k8s,
    liunx,
    script,
    upload_hadess,
    upload_ssh,
    download_hadess,
    download_ssh,
    build_go,
    sourcefare,
    build_python,
    build_php,
    build_net_core,
    build_gradle,
    build_c_add,
    checkpoint,
    host_blue_green,
    host_strategy,
    docker_blue_green,
    k8s_blue_green,
} from '../../../../../common/utils/Constant';
import "./TaskAdd.scss";
import {disableFunction} from "tiklab-core-ui";
import {EnhanceModalContent} from "../../../../../common/component/modal/EnhanceEntranceModal";

const TaskAdd = props =>{

    const {pipeline,setTaskFormDrawer,setNewStageDrawer,newStageDrawer,createValue,taskStore,stageStore} = props

    const {createTask,setDataItem} = taskStore
    const {createStage,createStagesGroupOrTask} = stageStore

    const scrollRef = useRef(null);
    const disable = disableFunction();

    //任务组
    const [taskType,setTaskType] = useState("code");
    //特性弹出框
    const [featureModal,setFeatureModal] = useState(false);

    // task类型
    const lis=[
        {
            id:"code",
            title:"源码",
            desc:[
                {type: git},
                {type: gitpuk},
                {type: gitee},
                {type: github},
                {type: gitlab},
                {type: svn},
                {type: pri_gitlab},
            ]
        },
        {
            id:"scan",
            title: "代码扫描",
            desc: [
                {type: sonar},
                {type: sourcefare},
            ]
        },
        {
            id:"test",
            title:"测试",
            desc:[
                {type: testhubo},
            ]
        },
        {
            id:"build",
            title: "构建",
            desc:[
                {type: mvn},
                {type: nodejs},
                {type: build_docker},
                {type: build_go},
                {type: build_python},
                {type: build_php},
                {type: build_net_core},
                {type: build_gradle},
                {type: build_c_add},
            ]
        },
        {
            id:"deploy",
            title: "部署",
            desc:[
                {type: liunx},
                {type: docker},
                {type: k8s},
            ]
        },
        {
            id: "strategy",
            title: "部署策略",
            desc: [
                {type: host_blue_green},
                {type: docker_blue_green},
                {type: k8s_blue_green},
            ]
        },
        {
            id:"tool",
            title: "工具",
            desc: [
                {type: checkpoint},
                {type: script},
                {type: upload_hadess},
                {type: upload_ssh},
                {type: download_hadess},
                {type: download_ssh},
            ]
        }
    ]

    //部署策略
    const stageTypeTaskMap = {
        [host_blue_green]: [liunx, host_strategy, host_strategy],
        [docker_blue_green]: [docker, host_strategy, host_strategy],
        [k8s_blue_green]: [k8s, host_strategy, host_strategy],
    };

    /**
     * 添加task
     * @param item
     */
    const addTask = (item) => {
        const { type: itemType } = item;
        const { id: pipelineId, type: pipelineType } = pipeline;
        // 判断是否是蓝绿部署类型
        if (stageTypeTaskMap[itemType]) {
            if(disable){
                setFeatureModal(true)
                return;
            }
            createStagesGroupOrTask({
                pipelineId,
                ...createValue,
                taskTypeList: stageTypeTaskMap[itemType],
                stageType: itemType
            }).then(() => {
                setNewStageDrawer(false);
            });
            return;
        }
        const createFn = pipelineType === 1 ? createTask : createStage;
        createFn({
            taskType: itemType,
            pipelineId,
            ...createValue
        }).then(res => {
            setTaskFormValue(res, itemType);
            setNewStageDrawer(false);
        });
    };


    /**
     * 添加后初始化task基本信息
     * @param data
     * @param type
     */
    const setTaskFormValue = (data,type) =>{
        if(data.code===0){
            setDataItem({
                taskId:data.data,
                taskType: type,
                formType:'task',
                taskName: '',
                task: {}
            })
            setTaskFormDrawer(true)
        }
    }

    /**
     * 锚点跳转
     * @param anchorName
     */
    const changeAnchor = anchorName =>{
        const scrollTop= scrollRef.current
        const anchorElement = document.getElementById(anchorName)
        if (anchorElement) {
            scrollTop.scrollTop = anchorElement.offsetTop
        }
        setTaskType(anchorName)
    }

    /**
     * 滚动加载
     */
    const onScroll = () =>{
        // 获取滚动区域元素到页面顶部的偏移offsetTop
        const offsets = lis.map(item=>{
            return {
                id: item.id,
                offsetTop: document.getElementById(item.id)?.offsetTop
            }
        })
        // 获取滚动区域滚动的距离
        const scrollTop = scrollRef.current.scrollTop
        // 获取第一个符合要求的对象
        const ids = offsets.find(item=> item.offsetTop===scrollTop || item.offsetTop>scrollTop)
        if(!ids){
            return;
        }
        if(ids.id===taskType){
            return;
        }
        setTaskType(ids.id)
    }

    const taskBanList = [k8s_blue_green];

    return (
        <PipelineDrawer
            onClose={()=>setNewStageDrawer(false)}
            visible={newStageDrawer}
            width={600}
            mask={true}
            className="task-add"
        >
            <div className="task-add-up">
                <div className="wrapper-head-title">选择任务</div>
                <CloseOutlined
                    onClick={()=>setNewStageDrawer(false)}
                    className='task-add-up-action'
                />
            </div>
            <Modal
                closable={false}
                footer={null}
                className='task-add-enhance-modal'
                width={450}
                visible={featureModal}
                onCancel={()=>setFeatureModal(false)}
            >
                <EnhanceModalContent
                    config={{
                        title:'部署策略',
                        desc:'通过不同的策略，稳定、高效的发布应用'
                    }}
                />
            </Modal>
            <div className="task-add-bottom">
                <Row className="gui-drawer-content">
                    <Col span={4} className="gui-drawer-content-left">
                        <div className="drawerLeft">
                            {
                                lis && lis.map(item=>(
                                    <div key={item.id}
                                         className={`item ${taskType===item.id? "item-select":""}`}
                                         onClick={()=>changeAnchor(item.id)}
                                    >
                                        <div className="item-title">{item.title}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </Col>
                    <Col span={20} className="gui-drawer-content-right" >
                        <div className="drawerRight" ref={scrollRef} onScroll={onScroll}>
                            {
                                lis && lis.map((group)=>(
                                    <div className="group" key={group.id} id={group.id}>
                                        <div className="group-title">{group.title}</div>
                                        <div className="group-content">
                                            {
                                                group.desc && group.desc.map((item,index)=>{
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`group-desc ${taskBanList.includes(item.type) ? 'group-desc-ban' : ''}`}
                                                            onClick={()=>taskBanList.includes(item.type) ? undefined : addTask(item)}
                                                        >
                                                            <div className='group-desc-icon'>
                                                                <TaskIcon
                                                                    type={item.type}
                                                                    width={24}
                                                                    height={24}
                                                                />
                                                            </div>
                                                            <div className='group-desc-right'>
                                                                <div className='group-desc-title'>
                                                                    {taskTitle(item.type)}
                                                                </div>
                                                                {
                                                                    item.type===pri_gitlab &&
                                                                    <div className='group-desc-info'>API V4及以上版本</div>
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </Col>
                </Row>
            </div>
        </PipelineDrawer>
    )
}

export default inject("taskStore","stageStore")(observer(TaskAdd))

