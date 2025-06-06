/**
 * @Description: 消息添加或编辑
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/4/09
 */
import React,{useState,useEffect} from "react";
import {Form, Select, Checkbox, Table, Space, Tooltip, Input} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {getUser} from "tiklab-core-ui";
import ListEmpty from "../../../../common/component/list/ListEmpty";
import Modals from "../../../../common/component/modal/Modal";
import Profile from "../../../../common/component/profile/Profile";
import PostprocessUserAdd from "./MessageUserAdd";
import {Validation} from "../../../../common/utils/Client";

export const messageList = [
    "site",
    "email",
    "sms",
    "qywechat",
];

export const messageTitle = {
    site: "站内信",
    email: "邮箱通知",
    sms: "短信通知",
    qywechat: "企业微信机器人",
}

const MessageAddEdit = props =>{

    const {findPost,findCount,postprocessVisible,setPostprocessVisible,formValue,setFormValue,pipelineMessageStore,pipelineId} = props

    const {createTaskMessage,updateTaskMessage,mesSendData} = pipelineMessageStore;

    const [form] = Form.useForm();
    const user = getUser();

    //选中的通知人员
    const [yUserList,setYUserList] = useState([]);

    useEffect(()=>{
        if(postprocessVisible){
            if(formValue){
                // 初始化表单
                form.setFieldsValue({
                    ...formValue,
                    typeList: formValue.typeList?.map(item=>item.sendType),
                })
                setYUserList(formValue?.userList || [])
                return
            }
            // 初始化通知用户
            setYUserList([{
                user:{...user,id:user.userId},
            }])
        }
     },[postprocessVisible])

    /**
     * 移出用户
     * @param record
     */
    const remove = record =>{
        setYUserList(yUserList.filter(item=>item.user.id!==record.user.id))
    }

    /**
     * 消息通知方式是否禁止
     * @param type
     * @returns {boolean}
     */
    const isType = type => mesSendData && mesSendData.some(item=>item===type)

    /**
     * 添加或者更新消息
     */
    const onOk = () => {
        form.validateFields().then(async (value)=>{
            let userList = yUserList && yUserList.map(item=>({user: {id:item.user.id}}));
            const typeList = value?.typeList.map(item=>({sendType:item}));
            let res;
            let params = {
                pipelineId: pipelineId,
                name: value.name,
                noticeType:value.noticeType,
                typeList,userList,
                type:1,
            }
            if(formValue){
                res = await updateTaskMessage({
                    ...params,
                    id:formValue.id,
                })
            } else {
                res = await createTaskMessage(params)
            }
            if(res.code===0){
                findPost()
                findCount()
                onCancel()
            }
        })
    }

    /**
     * 关闭弹出框
     */
    const onCancel = () =>{
        setFormValue(null);
        setYUserList([]);
        form.resetFields();
        setPostprocessVisible(false);
    }

    const columns = [
        {
            title: "成员",
            dataIndex: ["user","nickname"],
            key: ["user","nickname"],
            width:"80%",
            ellipsis:true,
            render:(text,record)=> (
                <Space>
                    <Profile userInfo={record.user}/>
                    { text }
                </Space>
            )
        },
        {
            title:"操作",
            dataIndex:"action",
            key:"action",
            width:"20%",
            ellipsis:true,
            render: (text,record) => {
                if (record.user.id !== user.userId) {
                    return (
                        <DeleteOutlined
                            onClick={()=>remove(record)}
                        />
                    )
                }
            }
        },
    ]

    return (
        <Modals
            visible={postprocessVisible}
            onCancel={onCancel}
            onOk={onOk}
            width={600}
            title={formValue?"修改":"添加"}
        >
            <div className="postprocess-modal">
                <Form
                    form={form}
                    layout={"vertical"}
                    autoComplete={'off'}
                    initialValues={{typeList:["site"]}}
                >
                    <Form.Item name="name" label={"名称"} rules={[{required:true, message:"名称不能为空"},Validation("名称")]}>
                        <Input placeholder='名称'/>
                    </Form.Item>
                    <Form.Item name="noticeType" label={"通知事件"} rules={[{required:true, message:"通知事件不能为空"}]}>
                        <Select placeholder={'通知事件'}>
                            <Select.Option value={1}>全部</Select.Option>
                            <Select.Option value={2}>流水线运行成功</Select.Option>
                            <Select.Option value={3}>流水线运行失败</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label={"发送方式"} name={"typeList"} rules={[{required:true, message:"消息发送方式不能为空"}]}>
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
                    <div className="post-pose-user">
                        <div className="post-pose-title">
                            <div className="title-user">通知人员</div>
                            <PostprocessUserAdd
                                yUserList={yUserList}
                                setYUserList={setYUserList}
                            />
                        </div>
                        <Table
                            bordered={false}
                            columns={columns}
                            dataSource={yUserList}
                            rowKey={(record) => record.user.id}
                            pagination={false}
                            locale={{emptyText: <ListEmpty/>}}
                        />
                    </div>
                </Form>
            </div>
        </Modals>
    )
}

export default MessageAddEdit
