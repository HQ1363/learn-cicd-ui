/**
 * @Description: 任务消息通知
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/11
 */
import React,{useState,useEffect} from "react";
import {Checkbox, Select, Tooltip, Form, Input, Popconfirm, Spin} from "antd";
import {
    CaretRightOutlined,
    DeleteOutlined,
    CaretDownOutlined
} from "@ant-design/icons";
import {inject,observer} from "mobx-react";
import {getUser} from "tiklab-core-ui";
import Button from "../../../../../../common/component/button/Button";
import {Validation} from "../../../../../../common/utils/Client";
import ListEmpty from "../../../../../../common/component/list/ListEmpty";
import PostprocessUserAdd from "../../../../message/components/MessageUserAdd";
import "./Message.scss";
import {messageList, messageTitle} from "../../../../message/components/MessageAddEdit";
import Profile from "../../../../../../common/component/profile/Profile";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import {pipeline_task_update} from "../../../../../../common/utils/Constant";

const Message = props =>{

    const {pipelineMessageStore,dataItem,pipeline,findCount,poseObj,setPoseObj} = props

    const {
        deleteTaskMessage,createTaskMessage,findTaskMessageList,updateTaskMessage,
        findMessageSendType,mesSendData
    } = pipelineMessageStore

    const userId = getUser().userId;
    const [form] = Form.useForm();

    //消息通知数据
    const [postprocessData,setPostprocessData] = useState([]);
    //加载
    const [spinning,setSpinning] = useState(false);

    useEffect(()=>{
        //消息发送方式
        findMessageSendType()
    },[])

    useEffect(()=>{
        //消息通知
        findPost("init")
    },[dataItem.taskId])

    /**
     * 获取消息通知
     */
    const findPost = (mode) =>{
        setSpinning(true)
        findTaskMessageList({
            taskId: dataItem.taskId,
            type:2,
        }).then(res=>{
            if(res.code===0){
                setPostprocessData(res?.data || []);
                if(mode!=='init'){
                    findCount()
                }
            }
        }).finally(()=>{
            setSpinning(false)
        })
    }

    useEffect(() => {
        if(poseObj ){
            //初始化表单
            form.setFieldsValue({
                name:poseObj.name,
                typeList:poseObj.typeList,
                noticeType:poseObj.noticeType,
            })
        }
    }, [poseObj]);

    /**
     * 删除消息
     * @param e
     * @param item
     */
    const del = (e,item) => {
        e.stopPropagation()
        deleteTaskMessage(item.id).then(res=>{
            if(res.code===0){
                findPost()
            }
        })
    }

    /**
     * 取消编辑状态
     */
    const onCancel = () => {
        setPoseObj(null)
    }

    /**
     * 进入编辑状态
     * @param item
     */
    const edit = item =>{
        setPoseObj({
            ...item,
            pose:'edit',
            typeList:item?.typeList?.map(item=>item.sendType),
        })
    }

    /**
     * 确定更新
     */
    const onOk = () => {
        form.validateFields().then(async (values) => {
            const userList = poseObj.userList.map(item=>({user:{id:item.user.id}}));
            const typeList = values?.typeList.map(item=>({sendType:item}));
            let res;
            let params = {
                name:values.name,
                noticeType:values.noticeType,
                typeList,userList,
                pipelineId:pipeline.id,
                type:2,
            }
            if(poseObj.pose==='add'){
                res = await createTaskMessage({
                    ...params,
                    taskId: dataItem.taskId,
                })
            } else {
                res = await updateTaskMessage({
                    ...params,
                    id: poseObj.id,
                })
            }
            if(res.code===0){
                findPost()
                onCancel()
            }
        })
    }

    /**
     * 移出用户
     */
    const removeUser = (record) =>{
        poseObj.userList = poseObj.userList.filter(item=>item.user.id!==record.user.id)
        setPoseObj({...poseObj})
    }

    /**
     * 表单更改
     * @param value
     */
    const onValuesChange = value => {
        setPoseObj({
            ...poseObj,
            ...value
        })
    }

    //表单
    const poseHtml = item =>{
        const isType = type => mesSendData && mesSendData.some(item=>item===type)
        return (
            <div className="pose-item-content">
                <Form form={form} layout={"vertical"} onValuesChange={onValuesChange}>
                    <Form.Item name="name" label={"名称"} rules={[{required:true, message:"名称不能为空"},Validation("名称")]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="noticeType" label={"通知事件"} rules={[{required:true, message:"通知事件不能为空"}]}>
                        <Select placeholder={'通知事件'}>
                            <Select.Option value={1}>全部</Select.Option>
                            <Select.Option value={2}>流水线运行成功</Select.Option>
                            <Select.Option value={3}>流水线运行失败</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label={"发送方式"} name={"typeList"} rules={[{required:true, message:"发送方式不能为空"}]}>
                        <Checkbox.Group>
                            {
                                messageList.map(value=>{
                                    if(version!=='cloud' && value==='sms') return;
                                    return (
                                        <Tooltip title={isType(value) && `未配置${messageTitle[value]}`} key={value}>
                                            <Checkbox value={value} disabled={isType(value)}>
                                                {messageTitle[value]}
                                            </Checkbox>
                                        </Tooltip>
                                    )
                                })
                            }
                        </Checkbox.Group>
                    </Form.Item>
                    <div className="pose-item-user">
                        <div className="user-title">
                            <div className="title-user">通知人员</div>
                            <PostprocessUserAdd
                                type={'task'}
                                yUserList={poseObj}
                                setYUserList={setPoseObj}
                            />
                        </div>
                        {
                            poseObj.userList.map(userItem=>{
                                const {user} = userItem
                                return (
                                    <div className="pose-item-user-list" key={user.id}>
                                        <Profile userInfo={user}/>
                                        <div className="user-list-name">{user.nickname}</div>
                                        <div className="user-list-remove">
                                            {
                                                user.id===userId ?
                                                    <span className="remove-ban">
                                                        <DeleteOutlined />
                                                    </span>
                                                    :
                                                    <span data-title-bottom="移出用户" onClick={()=>removeUser(userItem)}>
                                                        <DeleteOutlined />
                                                    </span>
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Form>
                <div className="post-pose-btn">
                    <Button title={"取消"} isMar={true} onClick={onCancel}/>
                    <PrivilegeProjectButton code={pipeline_task_update} domainId={pipeline?.id}>
                        <Button title={"保存"} type={"primary"} onClick={onOk}/>
                    </PrivilegeProjectButton>
                </div>
            </div>
        )
    }

    const renderPose = (item,index) => {
        return (
            <div className="pose-pose-item" key={index}>
                <div className="pose-item-head"
                     onClick={()=>poseObj?.id ===item.id ? onCancel():edit(item)}
                >
                    <div className="pose-item-line">
                        {
                            poseObj?.id === item.id?
                                <CaretDownOutlined />:<CaretRightOutlined />
                        }
                    </div>
                    <div className="pose-item-title">
                        {item.name}
                    </div>
                    <PrivilegeProjectButton code={pipeline_task_update} domainId={pipeline?.id}>
                        <div className="pose-item-del">
                            <span data-title-bottom={"删除"} onClick={e=>e.stopPropagation()}>
                                 <Popconfirm
                                     placement="bottomRight"
                                     title={"你确定删除吗"}
                                     okText="确定"
                                     cancelText="取消"
                                     onConfirm={e=>del(e,item)}
                                 >
                                    <DeleteOutlined />
                                 </Popconfirm>
                            </span>
                        </div>
                    </PrivilegeProjectButton>
                </div>
                {
                    poseObj?.id === item.id && poseHtml(item)
                }
            </div>
        )
    }

    return(
        <div className="pose-pose">
            <div className="pose-pose-content">
                <PrivilegeProjectButton code={pipeline_task_update} domainId={pipeline?.id}>
                    { poseObj?.pose==='add' &&  <div className='add-title'>添加消息通知</div>}
                </PrivilegeProjectButton>
                { poseObj?.pose==='add' && poseHtml()}
                <Spin spinning={spinning}>
                    {
                        postprocessData && postprocessData.length > 0 ?
                            postprocessData.map((item,index)=>renderPose(item,index))
                            :
                            <ListEmpty />
                    }
                </Spin>
            </div>
        </div>
    )
}

export default inject("pipelineMessageStore")(observer(Message))
