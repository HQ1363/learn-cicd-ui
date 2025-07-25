/**
 * @Description: Agent
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React,{useState,useEffect} from 'react';
import {Row, Col, Table, Space, Radio, Spin} from "antd";
import BreadCrumb from "../../../../common/component/breadcrumb/BreadCrumb";
import ListIcon from "../../../../common/component/list/ListIcon";
import ListEmpty from "../../../../common/component/list/ListEmpty";
import ListAction from "../../../../common/component/list/ListAction";
import Page from "../../../../common/component/page/Page";
import {deleteSuccessReturnCurrenPage} from "../../../../common/utils/Client";
import agentStore from "../store/AgentStore";
import Button from "../../../../common/component/button/Button";
import {disableFunction} from "tiklab-core-ui";
import EnhanceModal from "../../../../common/component/modal/EnhanceModal";
import {DownOutlined, PlaySquareOutlined, RightOutlined} from "@ant-design/icons";
import "./Agent.scss";

const pageSize = 13;

const Agent = (props) => {

    const {AgentAddComponent,updateAgentRole} = props;

    const {findAgentPage,updateAgent,findAgentRoleList} = agentStore;

    const disable = disableFunction();

    const pageParam = {
        pageSize:pageSize,
        currentPage: 1,
    }

    //agent数据
    const [agentData,setAgentData] = useState({});
    //agent请求数据
    const [agentRequest,setAgentRequest]=useState({pageParam});
    //添加弹出框
    const [visible,setVisible] = useState(false);
    //特性弹出框
    const [featureModal,setFeatureModal] = useState(false);
    //加载
    const [spinning,setSpinning] = useState(false);
    //树的展开与闭合
    const [expandedTree,setExpandedTree] = useState([]);
    //执行策略
    const [agentRole,setAgentRole] = useState(null);

    useEffect(() => {
        //获取agent执行策略
        findAgentRole()
    }, []);

    /**
     * 获取agent执行策略
     */
    const findAgentRole = () => {
        findAgentRoleList().then(res=>{
            if(res.code===0){
                setAgentRole(res?.data?.[0])
            }
        })
    }

    /**
     * 执行策略
     */
    const onChange = (e) => {
        if(disable){
            setFeatureModal(true)
        } else {
            if(typeof updateAgentRole === 'function'){
                updateAgentRole(e,{
                    agentRole,
                    setAgentRole,
                })
            }
        }
    }

    useEffect(()=>{
        //获取agent
        findAgent()
    },[agentRequest]);

    /**
     * 获取Agent
     */
    const findAgent = () =>{
        setSpinning(true)
        findAgentPage({
            ...agentRequest,
            displayType: 'yes',
        }).then(res=>{
            if(res.code===0){
                setAgentData(res.data)
            }
        }).finally(()=>{
            setSpinning(false)
        })
    }

    /**
     * 换页
     */
    const changPage = (page) => {
        setAgentRequest({
            pageParam:{
                pageSize:pageSize,
                currentPage: page,
            }
        })
    }

    /**
     * 删除agent
     */
    const delAgent = (record) => {
        updateAgent({
            ...record,
            displayType: 'no'
        }).then(res=>{
            if(res.code===0){
                const current = deleteSuccessReturnCurrenPage(agentData.totalRecord,pageSize,agentRequest.pageParam.currentPage)
                changPage(current)
            }
        })
    }

    /**
     * 添加
     */
    const addAgent = () =>{
        if(disable){
            setFeatureModal(true)
        } else {
            setVisible(true)
        }
    }

    const columns = [
        {
            title:"名称",
            dataIndex:"name",
            key:"name",
            width:"25%",
            ellipsis:true,
            render:(text,record) => (
                <span>
                    <ListIcon text={text}/>
                    <span>{text}</span>
                </span>
            )
        },
        {
            title:"IP地址",
            dataIndex:"ip",
            key:"ip",
            width:"25%",
            ellipsis:true,
            render:text => text || "--"
        },
        {
            title:"连接时间",
            dataIndex:"createTime",
            key:"createTime",
            width:"25%",
            ellipsis:true,
            render:text => text || "--"
        },
        {
            title:"状态",
            dataIndex: "connect",
            key: "connect",
            width:"15%",
            ellipsis:true,
            render:text => text?<span className="agent-text-success">已连接</span>:<span className="agent-text-danger">未连接</span>
        },
        version==='ce' ? {width: 0} : {
            title:"操作",
            dataIndex: "action",
            key: "action",
            width:"10%",
            ellipsis:true,
            render:(text,record) => (
                <ListAction
                    del={()=>delAgent(record)}
                    isMore={true}
                />
            )
        },
    ]

    /**
     * 是否符合要求
     * @param key
     * @returns {boolean}
     */
    const isExpandedTree = key => {
        return expandedTree.some(item => item ===key)
    }

    /**
     * 展开和闭合
     * @param key
     */
    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
            // false--闭合
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            // ture--展开
            setExpandedTree(expandedTree.concat(key))
        }
    }

    const lis = [
        {
            key:1,
            title:"执行策略",
            desc: "Agent",
            icon: <PlaySquareOutlined />,
            content: (
                <div className="bottom-agent">
                    <Radio.Group value={agentRole?.type} onChange={onChange}>
                        <Space direction="vertical" size={'large'}>
                            <Radio value={1}>
                                随机
                                <div className='bottom-agent-desc'>
                                    随机使用已连接的Agent
                                </div>
                            </Radio>
                            <Radio value={2}>
                                轮询
                                <div className='bottom-agent-desc'>
                                    轮询使用已连接的Agent
                                </div>
                            </Radio>
                            <Radio value={3}>
                                优先空闲
                                <div className='bottom-agent-desc'>
                                    优先使用空闲的Agent
                                </div>
                            </Radio>
                        </Space>
                    </Radio.Group>
                </div>
            )
        },
    ]

    return (
        <Row className="agent">
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "18", offset: "3" }}
                xxl={{ span: "16", offset: "4" }}
            >
                <div className='arbess-home-limited'>
                    <BreadCrumb
                        crumbs={[
                            {title:'Agent'}
                        ]}
                    >
                        <Button
                            type={'primary'}
                            onClick={addAgent}
                        >添加Agent</Button>
                    </BreadCrumb>
                    {
                        AgentAddComponent &&
                        <AgentAddComponent
                            visible={visible}
                            setVisible={setVisible}
                            findAgent={findAgent}
                            findAgentPage={findAgentPage}
                        />
                    }
                    <EnhanceModal
                        type={'configure'}
                        visible={featureModal}
                        setVisible={setFeatureModal}
                    />
                    <div className="agent-content">
                        <Spin spinning={spinning}>
                            <Table
                                columns={columns}
                                dataSource={agentData?.dataList || []}
                                rowKey={record=>record.id}
                                pagination={false}
                                locale={{emptyText: <ListEmpty />}}
                            />
                            <Page
                                currentPage={agentRequest.pageParam.currentPage}
                                changPage={changPage}
                                page={agentData}
                            />
                        </Spin>
                        <div className='auth-agent'>
                            <div className='auth-agent-title'>
                                Agent执行策略
                            </div>
                            <div className="auth-agent-ul">
                                {
                                    lis.map(item=> (
                                        <div key={item.key} className="auth-agent-li">
                                            <div className={`auth-agent-li-top ${isExpandedTree(item.key) ?"auth-agent-li-select":"auth-agent-li-unselect"}`}
                                                 onClick={()=>setOpenOrClose(item.key)}
                                            >
                                                <div className="auth-agent-li-icon">{item.icon}</div>
                                                <div className="auth-agent-li-center">
                                                    <div className="auth-agent-li-title">{item.title}</div>
                                                    {
                                                        !isExpandedTree(item.key) &&
                                                        <div className="auth-agent-li-desc">{item.desc}</div>
                                                    }
                                                </div>
                                                <div className="auth-agent-li-down">
                                                    { isExpandedTree(item.key)? <DownOutlined />:<RightOutlined /> }
                                                </div>
                                            </div>
                                            <div className={`${isExpandedTree(item.key)? "auth-agent-li-bottom":"auth-agent-li-none"}`}>
                                                { isExpandedTree(item.key) && item.content }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    )
}


export default Agent
