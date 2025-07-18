/**
 * @Description: 消息
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/11
 */
import React,{useState,useEffect} from "react";
import {Col, Row, Space, Spin, Table, Tooltip} from "antd";
import {inject,observer} from "mobx-react";
import MessageAddEdit, {messageTitle} from "./MessageAddEdit";
import Button from "../../../../common/component/button/Button";
import ListEmpty from "../../../../common/component/list/ListEmpty";
import ListAction from "../../../../common/component/list/ListAction";
import "./Message.scss";
import {pipeline_task_update} from "../../../../common/utils/Constant";
import {sendTypeIcon} from "tiklab-message-ui/es/utils/Client";
import Page from "../../../../common/component/page/Page";
import {deleteSuccessReturnCurrenPage} from "../../../../common/utils/Client";
import VersionInfo from "../../../../common/component/versionInfo/VersionInfo";

const pageSize = 13;

const Message = props =>{

    const {findCount,taskStore,pipelineMessageStore,match} = props;

    const {findTaskMessagePage,deleteTaskMessage,findMessageSendType} = pipelineMessageStore;
    const {taskPermissions} = taskStore;

    //流水线更新
    const taskUpdate = taskPermissions?.includes(pipeline_task_update);
    //流水线id
    const pipelineId = match.params.id;
    const pageParam = {
        pageSize: pageSize,
        currentPage: 1,
    }
    //弹出框
    const [postprocessVisible,setPostprocessVisible] = useState(false);
    //编辑内容
    const [formValue,setFormValue] = useState(null);
    //消息数据
    const [postprocessData,setPostprocessData] = useState([]);
    //加载
    const [spinning,setSpinning] = useState(false);
    //请求数据
    const [requestParam,setRequestParam] = useState({pageParam});

    useEffect(()=>{
        //是否存在消息发送方式
        findMessageSendType()
    },[])

    useEffect(() => {
        //获取消息
        findPost()
    }, [requestParam]);

    /**
     * 获取消息
     */
    const findPost = () =>{
        setSpinning(true)
        findTaskMessagePage({
            pipelineId,
            type:1,
            ...requestParam
        }).then(res=>{
            if(res.code===0){
                setPostprocessData(res.data)
            }
        }).finally(()=>{
            setSpinning(false)
        })
    }

    /**
     * 换页
     * @param page
     */
    const changPage = page=>{
        setRequestParam({
            ...requestParam,
            pageParam: {
                currentPage: page,
                pageSize: pageSize
            }
        })
    }

    /**
     * 添加消息
     */
    const addPostprocess = () =>{
        setPostprocessVisible(true)
    }

    /**
     * 编辑消息
     * @param record
     */
    const editPostprocess = record =>{
        setFormValue(record)
        setPostprocessVisible(true)
    }

    /**
     * 删除消息
     * @param record
     */
    const delPostprocess = record => {
        deleteTaskMessage(record.id).then(res=>{
            if(res.code===0){
                const page = deleteSuccessReturnCurrenPage(postprocessData.totalRecord,pageSize,postprocessData.currentPage)
                changPage(page)
                findCount()
            }
        })
    }

    const columns = [
        {
            title: "名称",
            dataIndex: "name",
            key: "name",
            width:"30%",
        },
        {
            title: "通知事件",
            dataIndex: "noticeType",
            key: "noticeType",
            width:"20%",
            render: text=>(
                <>
                    {text===1&&'全部'}
                    {text===2&&'运行成功通知'}
                    {text===3&&'运行失败通知'}
                </>
            )
        },
        {
            title: "发送方式",
            dataIndex: "typeList",
            key: "typeList",
            width:"20%",
            render:(text)=> {
                return text?.length > 0 ?
                    <Space>
                        {
                            text.map(({sendType})=>(
                                <Tooltip title={messageTitle[sendType]} key={sendType}>
                                    <img
                                        src={sendTypeIcon[sendType]}
                                        alt={messageTitle[sendType]}
                                        style={{width:20,height:20}}
                                    />
                                </Tooltip>
                            ))
                        }
                    </Space>
                    : '--'
            }
        },
        {
            title: "通知人员数",
            dataIndex: "userList",
            key: "userList",
            width:"20%",
            render:(text)=> {
                return text?.length > 0 ? text.length : '0'
            }
        },
        taskUpdate ? {
            title: "操作",
            dataIndex: "action",
            key: "action",
            ellipsis:true,
            render:(_,record) => {
                return (
                    <ListAction
                        edit={()=>editPostprocess(record)}
                        del={()=>delPostprocess(record)}
                        isMore={true}
                    />
                )
            }
        } : {width: 0},
    ]

    return (
        <Row className="design-content">
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "18", offset: "3" }}
                xxl={{ span: "16", offset: "4" }}
                className="post-pose"
            >
                <div className='post-pose-box'>
                    <div className="post-pose-up">
                        <div className="post-pose-up-num">
                            共{postprocessData?.totalRecord||0}条
                        </div>
                        { taskUpdate && <Button title={"添加"} onClick={addPostprocess}/> }
                        <MessageAddEdit
                            {...props}
                            pipelineId={pipelineId}
                            findPost={findPost}
                            findCount={findCount}
                            formValue={formValue}
                            setFormValue={setFormValue}
                            postprocessVisible={postprocessVisible}
                            setPostprocessVisible={setPostprocessVisible}
                        />
                    </div>
                    <div className='post-pose-content'>
                        <Spin spinning={spinning}>
                            <div className={`trigger-tables ${postprocessData?.totalRecord > 0 ? '' : 'trigger-tables-empty'}`}>
                                <Table
                                    bordered={false}
                                    columns={columns}
                                    dataSource={postprocessData?.dataList || []}
                                    rowKey={record=>record.id}
                                    pagination={false}
                                    locale={{emptyText: <ListEmpty />}}
                                />
                                <Page
                                    currentPage={postprocessData.currentPage}
                                    changPage={changPage}
                                    page={postprocessData}
                                />
                            </div>
                        </Spin>
                    </div>
                </div>
                <VersionInfo />
            </Col>
        </Row>
    )
}

export default inject("pipelineMessageStore","taskStore")(observer(Message))
