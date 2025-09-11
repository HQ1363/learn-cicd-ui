/**
 * @Description: 服务集成添加编辑弹出框
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React,{useEffect } from "react";
import {Form,Input,Tooltip,Spin} from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";
import AuthType from "../../../common/AuthType";
import serverStore from "../store/ServerStore";
import authorizeStore from "../../../../pipeline/design/processDesign/gui/store/AuthorizeStore";
import {Validation} from "../../../../common/utils/Client";
import Modals from "../../../../common/component/modal/Modal";
import {
    serverGitee,
    serverGithub,
    serverGitlab,
    serverPriGitlab,
    serverGitpuk,
    serverPostIn,
    serverHadess,
    serverSourceFare,
    serverGitea,
} from "../../../../common/utils/Constant";

const ServerDetailModal = props =>{

    const {visible,setVisible,formValue,findAuth,type, isConfig} = props

    const {createAuthServer,updateAuthServer} = serverStore
    const {skin} = authorizeStore

    const [form] = Form.useForm();


    useEffect(()=>{
        if(visible && formValue){
            // 表单初始化
            form.setFieldsValue(formValue)
        }
    },[visible])

    /**
     * 服务配置添加或者更新确定
     */
    const onOk = () =>{
        if(skin) return
        form.validateFields().then((values) => {
            const param = {
                type: type,
                ...values,
            }
            if(formValue){
                param.serverId = formValue.serverId;
                updateAuthServer(param).then(r=>{
                    if(r.code===0){
                        findAuth()
                        onCancel()
                    }
                })
            } else {
                createAuthServer(param).then(r=>{
                    if(r.code===0){
                        findAuth()
                        onCancel()
                    }
                })
            }
        })
    }

    /**
     * 关闭弹出框
     */
    const onCancel = () => {
        if(!skin){
            form.resetFields()
            setVisible(false)
        }
    }

    /**
     * 服务地址是否禁用
     */
    const serverAddressDisabled = [serverGitpuk, serverHadess, serverPostIn, serverSourceFare].includes(type) && version === 'cloud'

    const serverWayHtml = () => {
        switch (type) {
            case serverGitee:
            case serverGithub:
            case serverGitlab:
                return (
                    <Form.Item
                        name={'accessToken'}
                        label={'AccessTocken'}
                        rules={[
                            {required:true,message:"AccessTocken不能空"},
                        ]}
                    >
                        <Input.Password placeholder={'AccessTocken'}/>
                    </Form.Item>
                )
            case serverPriGitlab:
            case serverGitea:
                return (
                    <>
                        <Form.Item
                            name={'serverAddress'}
                            label={'服务器地址'}
                            rules={[
                                {required:true,message:"Gitlab服务器地址不能空"},
                                {
                                    pattern:/^(https?:\/\/)[^\s\/]+(\.[^\s\/]+)+(\/[^\s\/]*)*[^\s\/\\.,。，、;:'"?!]$/,
                                    message:"请输入正确的服务器地址"
                                }
                            ]}
                        >
                            <Input placeholder={'服务器地址，如 http://172.13.1.10:80'}/>
                        </Form.Item>
                        <Form.Item
                            name={'accessToken'}
                            label={'AccessTocken'}
                            rules={[
                                {required:true,message:"AccessTocken不能空"},
                            ]}
                        >
                            <Input placeholder={'AccessTocken'}/>
                        </Form.Item>
                    </>
                )
            default:
                return (
                    <>
                        <Form.Item
                            label={
                                <>  服务器地址
                                    <Tooltip title="服务器地址">
                                        <QuestionCircleOutlined style={{paddingLeft:5,cursor:"pointer"}}/>
                                    </Tooltip>
                                </>}
                            name="serverAddress"
                            rules={[
                                {required:true,message:"服务器地址不能空"},
                                {
                                    pattern:/^(https?:\/\/)[^\s\/]+(\.[^\s\/]+)+(\/[^\s\/]*)*[^\s\/\\.,。，、;:'"?!]$/,
                                    message:"请输入正确的服务地址"
                                }
                            ]}
                        >
                            <Input disabled={serverAddressDisabled} type={"url"} placeholder={'服务器地址'}/>
                        </Form.Item>
                        <AuthType/>
                    </>
                )
        }
    }

    return(
        <Modals
            visible={visible}
            onCancel={onCancel}
            onOk={onOk}
            title={formValue?"修改":"添加"}
        >
            <Spin spinning={skin} tip="获取授权信息...">
                <div className="resources-modal">
                    <Form
                        form={form}
                        layout="vertical"
                        autoComplete="off"
                        initialValues={{authWay:1,authType:1}}
                    >
                        <Form.Item
                            name="name"
                            label="名称"
                            rules={[{required:true,message:`名称不能空`},Validation("名称")]}
                        >
                            <Input placeholder={'名称'}/>
                        </Form.Item>
                        { serverWayHtml() }
                    </Form>
                </div>
            </Spin>
        </Modals>
    )
}

export default ServerDetailModal
