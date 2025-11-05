/**
 * @Description: 设计
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/11
 */
import React,{useState,useEffect} from "react";
import {message, Spin} from "antd";
import {inject,observer,Provider} from "mobx-react";
import taskStore from "../processDesign/gui/store/TaskStore";
import stageStore from "../processDesign/gui/store/StageStore";
import historyStore from "../../history/store/HistoryStore";
import variableStore from "../variable/store/VariableStore";
import pipelineMessageStore from "../message/store/PipelineMessageStore";
import triggerStore from "../trigger/store/TriggerStore";
import webhookStore from "../trigger/store/WebhookStore";
import countStore from "../../../setting/home/store/CountStore";
import Button from "../../../common/component/button/Button";
import BreadCrumb from "../../../common/component/breadcrumb/BreadCrumb";
import HistoryRunDetail from "../../history/components/HistoryRunDetail";
import PipelineDrawer from "../../../common/component/drawer/Drawer";
import Gui from "../processDesign/gui/component/Gui";
import Trigger from "../trigger/components/Trigger";
import Variable from "../variable/components/Variable";
import Message from "../message/components/Message";
import "./Design.scss";
import {getUser} from "tiklab-core-ui";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import {delay} from "../../../common/utils/Client";

const Design = props =>{

    const store = {
        taskStore,
        stageStore,
        pipelineMessageStore,
        variableStore,
        triggerStore,
        webhookStore,
    }

    const {match,pipelineStore,systemRoleStore} = props

    const {domainPermissions} = systemRoleStore;
    const {pipeline,findOnePipeline} = pipelineStore;
    const {execStart,validExecPipeline} = historyStore;
    const {setTaskPermissions,taskFresh,mustFieldFresh} = taskStore;
    const {validStagesMustField,stageMustField,stageFresh} = stageStore;
    const {findPipelineCount} = countStore;

    const userId = getUser().userId;
    const pipelineId = match.params.id;

    const pipelinePermissions = domainPermissions[`${userId}_${pipelineId}`] && domainPermissions[`${userId}_${pipelineId}`];

    //点击运行按钮
    const [isSpin,setIsSpin] = useState(false);
    //运行页面展示||隐藏
    const [isDetails,setIsDetails] = useState(false);
    //单个历史信息
    const [historyItem,setHistoryItem] = useState(null);
    //选择类型
    const [active,setActive] = useState('config');
    //统计数
    const [pipelineCount,setPipelineCount] = useState({});

    useEffect(()=>{
        //获取统计
        findCount()
    },[])

    /**
     * 获取统计
     */
    const findCount = () => {
        findPipelineCount(pipelineId).then(res=>{
            if(res.code===0){
                setPipelineCount(res.data)
            }
        })
    }

    useEffect(() => {
        // 开发环境：如果没有获取到权限，使用默认全部权限
        const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev';
        
        if(pipelinePermissions){
            //权限
            setTaskPermissions(pipelinePermissions);
        } else if (isDevelopment) {
            // 🔑 开发模式下，设置默认全部权限
            console.log('[Mock] 🔓 设置默认流程设计权限');
            const defaultPermissions = [
                'pip_design_update',      // 设计更新（核心）
                'pip_design_view',
                'pipeline_task_update',
                'pipeline_task_create',
                'pipeline_task_delete',
                'pipeline_stage_update',
                'pipeline_stage_create',
                'pipeline_stage_delete',
                'pipeline_view',
                'pipeline_edit',
                'pipeline_delete',
                'pipeline_execute',
                'pipeline_clone'
            ];
            setTaskPermissions(defaultPermissions);
        }
    }, [pipelinePermissions]);

    useEffect(() => {
        //多阶段未填写必需任务
        validStagesMustField(pipelineId).then()
    }, [taskFresh,stageFresh,mustFieldFresh]);

    useEffect(()=>{
        //监听运行状态，获取流水线信息
        if(!isDetails){
            findOnePipeline(pipelineId)
        }
    },[isDetails])

    /**
     * 开始运行
     */
    const run = async () =>{
        setIsSpin(true);
        try {
            const exec = await validExecPipeline({ pipelineId: pipeline.id });
            if(exec.code!==0){
                await delay(700);
                setIsSpin(false);
                await delay(100);
                message.info(exec.msg);
                return;
            }
            const startRes = await execStart({ pipelineId: pipeline.id });
            if(startRes.code===0){
                setHistoryItem(startRes?.data)
                setIsDetails(true)
            }
            setIsSpin(false);
        } catch (e) {
            setIsSpin(false);
        }
    }

    const typeLis = [
        {
            id:`config`,
            title:"流程设计",
            long: false,
        },
        {
            id:`tigger`,
            title:"触发设置",
            long: false
        },
        {
            id:`variable`,
            title:"变量",
            long: pipelineCount?.variableNumber || '0'
        },
        // {
        //     id:`message`,
        //     title:"消息通知",
        //     long: pipelineCount?.massageNumber || '0'
        // }
    ]

    /**
     * 关闭弹出框
     */
    const goBack = () =>{
        setIsDetails(false);
        setHistoryItem(null);
    }


    //按钮组件
    const runButtonHtml = () => {
        if(!pipeline){return}
        const {state} = pipeline;
        if(state===2){
            return (
                <Button type={"primary"} title={"运行中"}/>
            )
        }
        if(stageMustField?.length>0){
            return (
                <Button type={"disabled"} title={"运行"}/>
            )
        }
        return (
            <Button type={"primary"} title={"运行"} onClick={run}/>
        )
    }

    return(
        <Provider {...store}>
            <div className="design">
                <Spin spinning={isSpin} tip={'效验流水线配置信息……'}>
                    <div className="design-up">
                        <div className="design-top">
                            <div className='design-top-nav'>
                                <BreadCrumb
                                    crumbs={[
                                        {title:'设计'}
                                    ]}
                                />
                                <div className="design-tabs">
                                    {
                                        typeLis.map(item=>{
                                            return(
                                                <div key={item.id} className={`design-tab ${active===item.id?"design-active":""}`}
                                                     onClick={()=>setActive(item.id)}
                                                >
                                                    <div className="design-tab-title">
                                                        {item.title}
                                                        {
                                                            item?.long &&
                                                            <span className="design-tab-long">{item.long}</span>
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="changeView-btn">
                                <PrivilegeProjectButton code={'pip_design_run'} domainId={pipelineId}>
                                    {runButtonHtml()}
                                </PrivilegeProjectButton>
                            </div>
                        </div>
                    </div>
                    { active==='config' &&
                        <Gui {...props}/>
                    }
                    { active==='tigger' &&
                        <Trigger {...props}/>
                    }
                    { active==='variable' &&
                        <Variable
                            {...props}
                            findCount={findCount}
                        />
                    }
                    { active==='message' &&
                        <Message
                            {...props}
                            findCount={findCount}
                        />
                    }
                </Spin>
            </div>
            <PipelineDrawer
                width={"75%"}
                visible={isDetails}
                onClose={goBack}
            >
                <HistoryRunDetail
                    back={goBack}
                    historyType={"drawer"}
                    historyItem={historyItem}
                    setHistoryItem={setHistoryItem}
                />
            </PipelineDrawer>
        </Provider>
    )
}

export default inject("pipelineStore","systemRoleStore")(observer(Design))
