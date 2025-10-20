/**
 * @Description: 流水线列表
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React, {useState, useEffect, useRef} from "react";
import {message, Tooltip, Table, Space, Spin, Dropdown, Form, Input} from "antd";
import {
    PlayCircleOutlined,
    LoadingOutlined,
    MinusCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    CopyOutlined,
    ExportOutlined,
} from "@ant-design/icons";
import {observer} from "mobx-react";
import historyStore from "../../history/store/HistoryStore";
import pipelineStore from "../store/PipelineStore";
import ListEmpty from "../../../common/component/list/ListEmpty";
import Profile from "../../../common/component/profile/Profile";
import ListIcon from "../../../common/component/list/ListIcon";
import Page from "../../../common/component/page/Page";
import Modals from "../../../common/component/modal/Modal";
import {debounce, delay} from "../../../common/utils/Client";
import pip_xingxing from "../../../assets/images/svg/pip_xingxing.svg";
import pip_xingxing_kong from "../../../assets/images/svg/pip_xingxing_kong.svg";
import pip_more from "../../../assets/images/svg/pie_more.svg";
import pip_setting from "../../../assets/images/svg/pip_setting.svg";
import "./PipelineTable.scss";
import {runStatusIcon} from "../../history/components/HistoryCommon";
import PipelineDelete from "./PipelineDelete";
import PipelineAddInfo from "./PipelineAddInfo";
import moment from "moment";

const PipelineTable = props =>{

    const {pipelineData,changPage,changFresh,setIsLoading}=props

    const {updateFollow,findPipelineCloneName,pipelineClone, importPipelineYaml,findUserPipeline} = pipelineStore;
    const {execStart,execStop,validExecPipeline}=historyStore;

    const [form] = Form.useForm();
    const pipelineAddInfoRef = useRef(null);

    //所有流水线
    const [pipelineList,setPipelineList] = useState([]);
    //克隆的对象
    const [pipelineObj,setPipelineObj] = useState(null);
    //克隆弹出框
    const [cloneVisible,setCloneVisible] = useState(false);
    //克隆状态
    const [cloneStatus,setCloneStatus] = useState(false);
    //删除弹出框
    const [delVisible,setDelVisible] = useState(false);
    //编辑弹出框
    const [editVisible,setEditVisible] = useState(false);
    //流水线
    const [pipeline,setPipeline] = useState(null);
    //下拉框
    const [dropVisible,setDropVisible] = useState(null);

    useEffect(()=>{
        if(cloneVisible){
            // 获取所有流水线
            findUserPipeline().then(res=>{
                if(res.code===0){
                    setPipelineList(res.data || [])
                }
            })
        }
    },[cloneVisible])

    /**
     * 收藏
     * @param record
     */
    const collectAction = record => {
        updateFollow({id:record.id}).then(res=>{
            if(record.collect===0){
                collectMessage(res,"收藏")
            } else {
                collectMessage(res,"取消")
            }
        })
    }

    /**
     * 收藏提示
     */
    const collectMessage = (res,info) =>{
        if(res.code===0){
            message.success(`${info}成功`)
            changFresh()
        } else {
            message.error(res.msg)
        }
    }

    /**
     * 运行或者终止
     */
    const work = debounce(async record =>{
        setIsLoading(true);
        const {state} = record;
        try {
            if(state===1){
                const exec = await validExecPipeline({ pipelineId: record.id });
                if(exec.code!==0){
                    await delay(700);
                    setIsLoading(false);
                    await delay(100);
                    message.info(exec.msg);
                    return;
                }
                const startRes = await execStart({ pipelineId: record.id });
                if(startRes.code===0){
                    goInstance({
                        id:record.id,
                        instanceId:startRes.data.instanceId
                    })
                }
                setIsLoading(false)
                return
            }
            const stopRes = await execStop(record.id);
            if(stopRes.code===0){
                changFresh()
            }
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false)
        }
    },1000)

    /**
     * 确定克隆
     */
    const onCloneOk = () => {
        form.validateFields().then(value=>{
            if(cloneStatus) return;
            setCloneStatus(true)
            pipelineClone({
                pipelineId:pipelineObj.id,
                pipelineName:value.name
            }).then(res=>{
                if(res.code===0){
                    message.success("克隆成功")
                    onCancel()
                    changFresh()
                } else {
                    message.error("克隆失败")
                }
            }).finally(()=>{
                setCloneStatus(false)
            })
        })
    }

    /**
     * 取消克隆
     */
    const onCancel = () =>{
        if(!cloneStatus){
            form.resetFields()
            setCloneVisible(false)
            setPipelineObj(null)
        }
    }


    /**
     * 关闭弹出框
     */
    const cancelEdit = () => {
        if (pipelineAddInfoRef.current) {
            pipelineAddInfoRef.current.onRest();
        }
        setEditVisible(false);
        setPipeline(null);
    }

    /**
     * 去历史构建详情
     * @param record
     * @returns {*}
     */
    const goInstance = record => {
        props.history.push(`/pipeline/${record.id}/history/${record.instanceId}`)
    }

    /**
     * 去概况页面
     */
    const goPipelineTask = (text,record) => {
        props.history.push(`/pipeline/${record.id}/config`)
    }

    /**
     * 更多操作
     * @param record
     * @param code
     */
    const moreAction = (record,code) => {
        setDropVisible(null);
        switch (code) {
            case 'edit':
                setEditVisible(true)
                break;
            case 'delete':
                setDelVisible(true);
                break;
            case 'setting':
                props.history.push(`/pipeline/${record.id}/setting/info`)
                break;
            case 'clone':
                findPipelineCloneName(record.id).then(res=>{
                    setPipelineObj({
                        id:record.id,
                        name:res.data || record.name,
                    })
                    form.setFieldsValue({name:res.data || record.name})
                    setCloneVisible(true)
                })
                break;
            case 'export':
                importPipelineYaml(record.id).then(response=>{
                    if(!response.code){
                        // 生成二进制数据的blob URL
                        const url = window.URL.createObjectURL(new Blob([response],{type: 'text/plain;charset=utf-8;content-type'}));
                        // 创建a标签并设置download属性
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `${record.name}.yaml`);
                        // 点击触发下载
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        // 释放内存
                        window.URL.revokeObjectURL(url);
                    }else {
                        message.error(response.msg)
                    }
                })
        }
    }

    const pipMoreActList = [
        {code:'edit',icon:<EditOutlined />, title:'编辑'},
        {code:'delete',icon:<DeleteOutlined />, title:'删除'},
        {code:'setting',icon: <img src={pip_setting} width={17} height={17} alt={''}/>, title:'设置'},
        {code:'line'},
        {code:'clone',icon:<CopyOutlined />, title:'克隆'},
        {code:'export',icon:<ExportOutlined />, title:'导出'},
    ]

    const columns = [
        {
            title: "流水线名称",
            dataIndex: "name",
            key: "name",
            width:"25%",
            ellipsis:true,
            render:(text,record)=>{
                return  <span className='pipelineTable-name' onClick={()=>goPipelineTask(text,record)}>
                            <ListIcon text={text} colors={record.color}/>
                            <span>{text}</span>
                        </span>
            }
        },
        {
            title: "最近构建",
            dataIndex: "lastBuildTime",
            key: "lastBuildTime",
            width:"25%",
            ellipsis:true,
            render:(text,record) =>{
                const {buildStatus,number} = record
                return (
                    <span>
                        { text || '无构建' }
                        { number &&
                            <span className='pipeline-number' onClick={() => goInstance(record)}># {number}
                                <span className='pipeline-number-desc'>{runStatusIcon(buildStatus)}</span>
                            </span>
                        }
                    </span>
                )
            }
        },
        {
            title: "负责人",
            dataIndex: ["user","nickname"],
            key: "user",
            width:"18%",
            ellipsis: true,
            render:(text,record) => {
                return (
                    <Space>
                        <Profile userInfo={record.user}/>
                        { text || '--'}
                    </Space>
                )
            }
        },
        {
            title: "创建时间",
            dataIndex: "createTime",
            key: "createTime",
            width: "18%",
            ellipsis: true,
            render: text => moment(text).format('YYYY-MM-DD')
        },
        {
            title: "操作",
            dataIndex: "action",
            key:"action",
            width:"14%",
            ellipsis:true,
            render:(text,record)=>{
                const { state,collect,exec,permissions={} } = record;
                const safePermissions = permissions || {};
                const actList = pipMoreActList.filter(item => {
                    if (item.code === 'line') return true;
                    const per = safePermissions[item.code];
                    return per === true;
                });
                return(
                    <Space size="middle">
                        <Tooltip title="收藏">
                            <span className="pipelineTable-action" onClick={()=>collectAction(record)}>
                                <img src={collect === 0 ? pip_xingxing_kong : pip_xingxing} alt={"收藏"} width={20} height={20}/>
                            </span>
                        </Tooltip>
                        {
                            permissions?.exec && (
                                <Tooltip title={exec ? (state===3 ? '等待' : '运行') : '流水线正在运行或等待运行中'}>
                                    <span
                                        className={exec ? 'pipelineTable-action' : 'pipelineTable-action-ban'}
                                        onClick={exec ? ()=>work(record) : undefined}
                                    >
                                        {
                                            exec ?
                                                <>
                                                    { state === 1 && <PlayCircleOutlined className="actions-se"/> }
                                                    { state === 2 && <Spin indicator={<LoadingOutlined className="actions-se" spin />} /> }
                                                    { state === 3 && <MinusCircleOutlined className="actions-se"/> }
                                                </>
                                                :
                                                <PlayCircleOutlined className="actions-se"/>
                                        }
                                    </span>
                                </Tooltip>
                            )
                        }
                        {
                            actList?.length > 1 &&
                            <Dropdown
                                overlay={
                                    <div className="arbess-dropdown-more">
                                        {
                                            actList.map(({code,icon,title},index)=>{
                                                if(code==='line'){
                                                    if(index===0 || index===actList.length-1) return;
                                                    return <div className='dropdown-more-item-line' key={code}></div>
                                                }
                                                return (
                                                    <div
                                                        key={code}
                                                        className={`dropdown-more-item dropdown-more-item-${code}`}
                                                        onClick={()=>moreAction(record,code)}
                                                    >
                                                        {icon} {title}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                                trigger={['click']}
                                placement={"bottomRight"}
                                visible={dropVisible === record.id}
                                onVisibleChange={visible => {
                                    if(visible){
                                        setPipeline(record)
                                    }
                                    setDropVisible(visible ? record.id : null);
                                }}
                            >
                                <Tooltip title="更多">
                                    <span className="pipelineTable-action">
                                        <img src={pip_more} width={18} alt={'更多'}/>
                                    </span>
                                </Tooltip>
                            </Dropdown>
                        }
                    </Space>
                )
            }
        },
    ]

    /**
     * 确定编辑
     */
    const okEdit = () => {
        if (pipelineAddInfoRef.current) {
            pipelineAddInfoRef.current.onOk();
        }
    }

    return  (
        <div className="pipelineTable">
            <Table
                columns={columns}
                dataSource={pipelineData?.dataList || []}
                rowKey={record=>record.id}
                pagination={false}
                locale={{emptyText: <ListEmpty />}}
            />
            <Page
                currentPage={pipelineData.currentPage}
                changPage={changPage}
                page={pipelineData}
            />
            <PipelineDelete
                pipeline={pipeline}
                delVisible={delVisible}
                setDelVisible={setDelVisible}
                changPage={changPage}
                page={pipelineData}
            />
            <Modals
                title={`编辑流水线`}
                visible={editVisible}
                onCancel={cancelEdit}
                onOk={okEdit}
                className='pipeline-edit'
            >
                <PipelineAddInfo
                    set={true}
                    ref={pipelineAddInfoRef}
                    pipeline={pipeline}
                    onClick={cancelEdit}
                    changFresh={changFresh}
                />
            </Modals>
            <Modals
                title={`复制流水线`}
                visible={cloneVisible}
                onOk={onCloneOk}
                onCancel={onCancel}
                width={500}
            >
                <Spin spinning={cloneStatus} tip={"克隆中……"}>
                    <div className="pipelineTable-clone-modal-form">
                        <Form form={form} layout={"vertical"}>
                            <Form.Item
                                name='name'
                                label='名称'
                                rules={[
                                    {required:true,message:"名称不能为空"},
                                    {
                                        pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]{0,30}$/,
                                        message: "流水线名称最长30位且不能包含非法字符，如&,%，&，#……等",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule,value) {
                                            let nameArray = []
                                            if(pipelineList){
                                                nameArray = pipelineList && pipelineList.map(item=>item.name)
                                            }
                                            if (nameArray.includes(value)) {
                                                return Promise.reject("名称已经存在");
                                            }
                                            return Promise.resolve()
                                        },
                                    }),
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        </Form>
                    </div>
                </Spin>
            </Modals>
        </div>
    )
}

export default observer(PipelineTable);
