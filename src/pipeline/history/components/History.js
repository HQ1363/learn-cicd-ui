/**
 * @Description: 流水线历史
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React, {useEffect, useRef, useState} from "react";
import {Table, Tooltip, Row, Col, message, Space, Spin} from "antd";
import {
    HistoryOutlined,
    MinusCircleOutlined,
    PlayCircleOutlined,
} from "@ant-design/icons";
import {observer} from "mobx-react";
import {deleteSuccessReturnCurrenPage, debounce, delay} from "../../../common/utils/Client";
import ListEmpty from "../../../common/component/list/ListEmpty";
import Profile from "../../../common/component/profile/Profile";
import BreadCrumb from "../../../common/component/breadcrumb/BreadCrumb";
import Page from "../../../common/component/page/Page";
import ListAction from "../../../common/component/list/ListAction";
import PipelineDrawer from "../../../common/component/drawer/Drawer";
import HistoryScreen from "./HistoryScreen";
import HistoryRunDetail from "./HistoryRunDetail";
import {runStatusIcon,runStatusText} from "./HistoryCommon";
import historyStore from "../store/HistoryStore";
import pipelineStore from "../../pipeline/store/PipelineStore";
import pip_trigger from "../../../assets/images/svg/pip_trigger.svg";
import "./History.scss";
import {runError, runHalt, runRun, runTimeout, runWait} from "../../../common/utils/Constant";
import {getUser} from "tiklab-core-ui";
import {PrivilegeButton,PrivilegeProjectButton} from "tiklab-privilege-ui";

const pageSize = 12;

const History = props =>{

    const {match,route} = props

    const {findOnePipeline} = pipelineStore;

    const {
        findUserInstance,findPipelineInstance,deleteInstance,execStart,execStop,rollBackStart,setHistoryList,
        validExecPipeline,findPipelineInstanceCount,page,historyList
    } = historyStore;

    const intervalRef = useRef(null);
    const user = getUser();
    const routePath = route.path==='/history';
    const pipelineId = match.params.id;

    //历史信息
    const [historyItem,setHistoryItem] = useState(null);
    //加载状态
    const [isLoading,setIsLoading] = useState(false);
    //加载提示语
    const [loadingTip,setLoadingTip] = useState('');
    //历史运行阶段详情状态
    const [runVisible,setRunVisible] = useState(false);
    const pageParam = {
        pageSize: pageSize,
        currentPage: 1,
    }
    //请求数据
    const [requestParam,setRequestParam] = useState({pageParam});
    //历史统计
    const [historyCount,setHistoryCount] = useState({});
    //标签选中状态
    const [activeTab,setActiveTab] = useState('all');

    useEffect(() => {
        return ()=>{
            setHistoryList([]);
            clearInterval(intervalRef.current);
        }
    }, []);

    /**
     * 历史统计
     */
    const findCount = () => {
        findPipelineInstanceCount({
            pipelineId: pipelineId,
            userId: user.userId,
            ...requestParam,
        }).then(res=>{
            if(res.code===0){
                setHistoryCount(res.data)
            }
        })
    }

    useEffect(()=>{
        setIsLoading(true);
        findInstance();
        findCount();
    },[requestParam,pipelineId])

    /**
     * 获取历史列表
     */
    const findInstance = () => {
        let param = {...requestParam};
        if(activeTab==='userId'){
            param.execUserId = requestParam?.execUserId || user.userId
        }
        if(activeTab==='state'){
            param.state = requestParam?.state || 'run'
        }
        clearInterval(intervalRef.current);
        const apiCall = routePath
            ? findUserInstance(param)
            : findPipelineInstance({ ...param, pipelineId: pipelineId });
        apiCall.then(Res=>{
            if(Res.code===0){
                if(!Res.data || Res.data.dataList.length<1 ){
                    return
                }
                const statesList = Res.data.dataList.map(item => item.runStatus) || [];
                const hasCriticalState = [runRun, runWait].some(state =>
                    statesList.includes(state)
                );
                if(hasCriticalState){
                    findInter()
                }
            }
        }).finally(()=>setIsLoading(false))
    }

    /**
     * 开启定时器
     */
    const findInter = () => {
        intervalRef.current = setInterval(()=>{
            let param = {...requestParam};
            if(activeTab==='userId'){
                param.execUserId = requestParam?.execUserId || user.userId
            }
            if(activeTab==='state'){
                param.state = requestParam?.state || 'run'
            }
            const apiCall = routePath
                ? findUserInstance(param)
                : findPipelineInstance({ ...param, pipelineId: pipelineId });
            apiCall.then(Res=>{
                if(!Res.data || Res.data.dataList.length<1 ){
                    clearInterval(intervalRef.current)
                }
                const statesList = Res.data.dataList.map(item => item.runStatus) || [];
                const hasCriticalState = [runRun, runWait].some(state =>
                    statesList.includes(state)
                );
                if(!hasCriticalState){
                    clearInterval(intervalRef.current)
                }
            })
        },1000)
    }

    /**
     * 切换列表详情页面
     * @param record
     */
    const details = record => {
        clearInterval(intervalRef.current);
        setHistoryItem(record);
        setRunVisible(true);
    }

    /**
     * 换页
     */
    const changPage = pages =>{
        setRequestParam(prev => ({
            ...prev,
            pageParam:{
                pageSize: pageSize,
                currentPage: pages,
            }
        }));
    }

    /**
     * 删除历史
     * @param record
     */
    const delHistory = record =>{
        deleteInstance(record.instanceId).then(res=>{
            if(res.code===0){
                const current = deleteSuccessReturnCurrenPage(page.totalRecord,pageSize,page.currentPage)
                changPage(current);
            }
        })
    }

    /**
     * 停止运行
     */
    const stopPipeline = debounce(record=>{
        setIsLoading(true);
        const {pipeline} = record;
        execStop(pipeline.id).then(res=>{

        }).finally(()=>setIsLoading(false))
    },1000);

    /**
     * 运行
     */
    const startPipeline = debounce(async (record) => {
        setIsLoading(true);
        const { pipeline } = record;
        try {
            setLoadingTip('查询流水线信息……');
            const res = await findOnePipeline(pipeline.id);
            if (res.code !== 0) {
                setIsLoading(false);
                setLoadingTip('');
                message.error(res.msg);
                return;
            }
            if (res.data.state === 2) {
                setIsLoading(false);
                setLoadingTip('');
                message.info("当前流水线正在运行！", 0.5);
                return;
            }
            setLoadingTip('效验流水线配置信息……');
            const exec = await validExecPipeline({ pipelineId: pipeline.id });
            if (exec.code !== 0) {
                await delay(700);
                setIsLoading(false);
                setLoadingTip('');
                await delay(100);
                message.info(exec.msg);
                return;
            }
            const startRes = await execStart({ pipelineId: pipeline.id });
            if (startRes.code === 0) {
                details(startRes.data);
            }
            setIsLoading(false);
            setLoadingTip('');
        } catch (err) {
            setIsLoading(false);
            setLoadingTip('');
        }
    }, 1000);

    /**
     * 回滚
     */
    const rollBackPipeline = debounce(async record => {
        setIsLoading(true);
        const {pipeline,instanceId} = record;
        try {
            setLoadingTip('查询流水线信息……');
            const res = await findOnePipeline(pipeline.id);
            if (res.code !== 0) {
                setIsLoading(false);
                setLoadingTip('');
                message.error(res.msg);
                return;
            }
            if (res.data.state === 2) {
                setIsLoading(false);
                setLoadingTip('');
                message.info("当前流水线正在运行！", 0.5);
                return;
            }
            setLoadingTip('效验流水线配置信息……');
            const startRes = await rollBackStart({
                pipelineId:pipeline.id,
                instanceId:instanceId
            });
            if(startRes.code===0){
                details(startRes.data);
            }
            setIsLoading(false);
            setLoadingTip('');
        } catch (e) {
            setIsLoading(false);
            setLoadingTip('');
        }
    },1000)

    const columns = [
        {
            title: "名称",
            dataIndex: "findNumber",
            key: "findNumber",
            width:"22%",
            ellipsis:true,
            render:(text,record) =>{
                return (
                    <span className="history-table-name" onClick={()=>details(record)}>
                        {
                            routePath &&
                            <span className="history-table-pipeline">{record.pipeline && record.pipeline.name}</span>
                        }
                        <span className="history-table-findNumber"> # {text}</span>
                    </span>
                )
            }
        },
        {
            title: "状态",
            dataIndex: "runStatus",
            key: "runStatus",
            width:"10%",
            ellipsis:true,
            render:(text,record) => (
                <Tooltip title={runStatusText(record.runStatus)}>
                    {runStatusIcon(record.runStatus)}
                </Tooltip>
            )
        },
        {
            title: "触发信息",
            dataIndex: "runWay",
            key: "runWay",
            width:"23%",
            ellipsis:true,
            render:(text,record) => (
                <div className="history-table-runWay">
                    {
                        text===1 &&
                        <>
                            <Profile userInfo={record?.user}/>
                            <div className="runWay-user">{record?.user?.nickname || "--"} · 手动触发</div>
                        </>
                    }
                    {
                        text===2 &&
                            <>
                                <img src={pip_trigger} alt={'trigger'} style={{width:22,height:22}}/>
                                <div className="runWay-user">定时触发</div>
                            </>
                    }
                    {
                        text===3 &&
                        <>
                            <Profile userInfo={record?.user}/>
                            <div className="runWay-user">{record?.user?.nickname || "--"} · 回滚触发</div>
                        </>
                    }
                    {
                        text===4 &&
                        <>
                            <img src={pip_trigger} alt={'trigger'} style={{width:22,height:22}}/>
                            <div className="runWay-user">WebHook触发</div>
                        </>
                    }
                </div>
            )
        },
        {
            title: "开始",
            dataIndex: "createTime",
            key: "createTime",
            width:"20%",
            ellipsis:true,
        },
        {
            title: "耗时",
            dataIndex: "runTimeDate",
            key: "runTimeDate",
            width:"15%",
            ellipsis:true,
        },
        {
            title: "操作",
            dataIndex: "action",
            key:"action",
            width:"10%",
            ellipsis:true,
            render:(_,record)=> {
                const {exec,rollbackExec,runStatus,instancePermissions} = record;
                switch (runStatus) {
                    case runRun:
                    case runWait:
                        return (
                            <Tooltip title={"终止"}>
                                <span
                                    onClick={()=>stopPipeline(record)}
                                    className='history-table-action'
                                >
                                    <MinusCircleOutlined />
                                </span>
                            </Tooltip>
                        )
                    default:
                        return (
                            <Space size='middle'>
                                {
                                    routePath ?
                                        <>
                                            {
                                                instancePermissions?.run &&
                                                <Tooltip title={exec ? "运行" : "流水线正在运行"} >
                                                    <span
                                                        onClick={exec ? ()=>startPipeline(record) : undefined}
                                                        className={exec ? 'history-table-action' : 'history-table-action-ban' }
                                                    >
                                                        <PlayCircleOutlined />
                                                    </span>
                                                </Tooltip>
                                            }
                                            {
                                                instancePermissions?.rollback &&
                                                <Tooltip title={rollbackExec ? "回滚" : "流水线正在运行或无法获取到制品"} >
                                                    <span
                                                        onClick={rollbackExec ? ()=>rollBackPipeline(record) : undefined}
                                                        className={rollbackExec ? 'history-table-action' : 'history-table-action-ban' }
                                                    >
                                                        <HistoryOutlined />
                                                    </span>
                                                </Tooltip>
                                            }
                                            {
                                                instancePermissions?.delete &&
                                                <ListAction
                                                    del={()=>delHistory(record)}
                                                    isMore={true}
                                                />
                                            }
                                        </>
                                        :
                                        <>
                                            <PrivilegeProjectButton domainId={pipelineId} code={'pip_history_run'}>
                                                {
                                                    exec ?
                                                        <Tooltip title={"运行"} >
                                                            <span
                                                                onClick={()=>startPipeline(record)}
                                                                className='history-table-action'
                                                            >
                                                                <PlayCircleOutlined />
                                                            </span>
                                                        </Tooltip>
                                                        :
                                                        <Tooltip title={"流水线正在运行"}>
                                                            <span className='history-table-action-ban'>
                                                                <PlayCircleOutlined />
                                                            </span>
                                                        </Tooltip>
                                                }
                                            </PrivilegeProjectButton>
                                            <PrivilegeProjectButton domainId={pipelineId} code={'pip_history_rollback'}>
                                                {
                                                    rollbackExec ?
                                                        <Tooltip title={"回滚"} >
                                                            <span
                                                                onClick={()=>rollBackPipeline(record)}
                                                                className='history-table-action'
                                                            >
                                                                <HistoryOutlined />
                                                            </span>
                                                        </Tooltip>
                                                        :
                                                        <Tooltip title={"流水线正在运行或无法获取到制品"} >
                                                            <span className='history-table-action-ban'>
                                                                <HistoryOutlined />
                                                            </span>
                                                        </Tooltip>
                                                }
                                            </PrivilegeProjectButton>
                                            <PrivilegeProjectButton domainId={pipelineId} code={'pip_history_delete'}>
                                                <ListAction
                                                    del={()=>delHistory(record)}
                                                    isMore={true}
                                                />
                                            </PrivilegeProjectButton>
                                        </>
                                }
                            </Space>
                        )
                }
            }
        }
    ]

    /**
     * 退出
     */
    const goBack = () => {
        setRunVisible(false);
        setHistoryItem(null);
        findInstance();
    }

    return (
        <Row className="history">
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "20", offset: "2" }}
                xxl={{ span: "18", offset: "3" }}
            >
                <div className="arbess-home-limited">
                    <BreadCrumb
                        crumbs={[
                            {title:'历史'}
                        ]}
                    />
                    <HistoryScreen
                        {...props}
                        pageParam={pageParam}
                        requestParam={requestParam}
                        setRequestParam={setRequestParam}
                        historyCount={historyCount}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                    <Spin spinning={isLoading} tip={loadingTip}>
                        <div className="history-table">
                            <Table
                                bordered={false}
                                columns={columns}
                                dataSource={historyList}
                                rowKey={record=>record.instanceId}
                                pagination={false}
                                locale={{emptyText: <ListEmpty />}}
                            />
                            <Page
                                currentPage={page.currentPage}
                                changPage={changPage}
                                page={page}
                            />
                        </div>
                    </Spin>
                </div>
                <PipelineDrawer
                    width={"75%"}
                    visible={runVisible}
                    onClose={goBack}
                >
                    <HistoryRunDetail
                        back={goBack}
                        historyType={"drawer"}
                        historyItem={historyItem}
                        setHistoryItem={setHistoryItem}
                    />
                </PipelineDrawer>
            </Col>
        </Row>
    )
}

export default observer(History)
