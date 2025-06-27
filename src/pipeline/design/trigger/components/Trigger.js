/**
 * @Description: 触发器
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/6/3
 */
import React, {useEffect, useState} from "react";
import {Row, Col, Spin, Form, Radio, TimePicker, Input, Switch, Button as ButtonA, message} from "antd";
import {inject,observer} from "mobx-react";
import "./Trigger.scss";
import {pipeline_task_update} from "../../../../common/utils/Constant";
import moment from "moment/moment";
import {CopyOutlined} from "@ant-design/icons";
import {copyText} from "../../../../common/utils/Client";

const Trigger = props =>{

    const {taskStore,triggerStore,webhookStore,match} = props

    const {taskPermissions} = taskStore;
    const {findPipelineTrigger,updateTrigger} = triggerStore;
    const {findPipelineWebHook,updateWebHook} = webhookStore;

    //触发设置类型
    const [triggerType,setTriggerType] = useState('webhook');
    //webHook触发数据
    const [webHookData,setWebHookData] = useState(null);
    //定时触发数据
    const [triggerData,setTriggerData] = useState(null);
    //加载状态
    const [spinning,setSpinning] = useState(false);
    //流水线更新
    const taskUpdate = taskPermissions?.includes(pipeline_task_update);
    //流水线id
    const pipelineId = match.params.id;
    //表单实例
    const [form] = Form.useForm();

    useEffect(() => {
        //获取webhook
        findWebHook()
        //获取定时触发器
        findTrigger()
    }, []);

    useEffect(() => {
        //初始化表单
        if (triggerType === 'webhook') {
            form.setFieldsValue({
                url: webHookData?.url,
                status: webHookData?.status===1
            });
        } else {
            form.setFieldsValue({
                ...triggerData,
                data: triggerData?.data ? moment(triggerData.data, "HH:mm") : null,
                status: triggerData?.status===1
            });
        }
    }, [triggerType,webHookData,triggerData]);

    /**
     * 获取webhook
     */
    const findWebHook = () => {
        setSpinning(true)
        findPipelineWebHook(pipelineId).then(res=>{
            if(res.code===0){
                setWebHookData(res.data);
            }
        }).finally(()=>{
            setSpinning(false)
        })
    }

    /**
     * 获取触发器
     */
    const findTrigger = () =>{
        setSpinning(true)
        findPipelineTrigger(pipelineId).then(res=>{
            if(res.code===0){
                setTriggerData(res.data)
            }
        }).finally(()=>{
            setSpinning(false)
        })
    }

    /**
     * 更新
     */
    const onValuesChange = (value,allValues) => {
        if(triggerType==='webhook'){
            updateWebHook({
                ...webHookData,
                status: value.status ? 1 : 2
            }).then(res=>{
                if(res.code===0){
                    findWebHook()
                    message.success('更新成功')
                } else {
                    message.error('更新失败')
                }
            })
        } else {
            const {status,data,...rest} = allValues;
            updateTrigger({
                ...triggerData,
                ...rest,
                status: status ? 1 : 2,
                data: data && data.format("HH:mm"),
            }).then(res=>{
                if(res.code===0){
                    findTrigger()
                    message.success('更新成功')
                } else {
                    message.error('更新失败')
                }
            })
        }
    }

    /**
     * 切换类型
     */
    const changTriggerType = type =>{
        setTriggerType(type);
    }

    return (
        <Row className="design-content">
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "18" , offset: "3"}}
                lg={{ span: "18", offset: "3" }}
                xl={{ span: "14", offset: "5" }}
                xxl={{ span: "12", offset: "6" }}
                className="trigger"
            >
                <Spin spinning={spinning}>
                    <div className='trigger-up'>
                        <div className='trigger-tabs'>
                            <div
                                className={`trigger-tab ${triggerType==='webhook' ? 'trigger-tab-active' :''}`}
                                onClick={()=>changTriggerType('webhook')}
                            >
                                Webhook触发
                            </div>
                            <div
                                className={`trigger-tab ${triggerType==='time' ? 'trigger-tab-active' :''}`}
                                onClick={()=>changTriggerType('time')}
                            >
                                定时触发
                            </div>
                        </div>
                    </div>
                    <div className="trigger-tables">
                        <Form
                            form={form}
                            labelCol={{span: 4}}
                            labelAlign={'left'}
                            colon={false}
                            onValuesChange={onValuesChange}
                        >
                            <Form.Item label="状态" name={"status"} valuePropName="checked">
                                <Switch
                                    disabled={!taskUpdate}
                                    checkedChildren="开启"
                                    unCheckedChildren="关闭"
                                />
                            </Form.Item>
                            {
                                triggerType==='webhook' ?
                                    <Form.Item label="WebHook地址" name={"url"}>
                                        <Input.Group compact>
                                            <Input
                                                style={{width: 'calc(100% - 32px)'}}
                                                value={webHookData?.url}
                                                disabled={!taskUpdate || webHookData?.status!==1}
                                            />
                                            <ButtonA
                                                icon={<CopyOutlined />}
                                                onClick={()=>copyText(webHookData.url)}
                                            />
                                        </Input.Group>
                                    </Form.Item>
                                    :
                                    <>
                                        <Form.Item label="触发方式" name={"execType"}>
                                            <Radio.Group disabled={!taskUpdate || triggerData?.status!==1}>
                                                <Radio value={1}>单次触发</Radio>
                                                <Radio value={2}>周期触发</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="日期选择" name={"weekTime"}>
                                            <Radio.Group disabled={!taskUpdate || triggerData?.status!==1}>
                                                <Radio.Button value={1} >星期一</Radio.Button>
                                                <Radio.Button value={2} >星期二</Radio.Button>
                                                <Radio.Button value={3} >星期三</Radio.Button>
                                                <Radio.Button value={4} >星期四</Radio.Button>
                                                <Radio.Button value={5} >星期五</Radio.Button>
                                                <Radio.Button value={6} >星期六</Radio.Button>
                                                <Radio.Button value={7} >星期天</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="触发时间" name={"data"}>
                                            <TimePicker
                                                placeholder="触发时间"
                                                format={"HH:mm"}
                                                disabled={!taskUpdate || triggerData?.status!==1}
                                            />
                                        </Form.Item>
                                    </>
                            }
                        </Form>
                    </div>
                </Spin>
            </Col>
        </Row>
    )
}

export default inject("triggerStore","webhookStore","taskStore")(observer(Trigger))
