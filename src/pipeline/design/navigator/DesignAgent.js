/**
 * @Description: Agent
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/11
 */
import React,{useEffect,useState} from "react";
import {Select,Form} from "antd";
import agentStore from "../../../setting/configure/agent/store/AgentStore";
import Modal from "../../../common/component/modal/Modal";

const DesignAgent = (props) => {

    const {defaultAgent,setDefaultAgent,agentVisible,setAgentVisible} = props;

    const {findAgentList} = agentStore;

    const [form] = Form.useForm();

    //agent列表
    const [agentList,setAgentList] = useState([]);

    useEffect(()=>{
        //获取agent列表
        findAgentList({
            displayType:'yes'
        }).then(res=>{
            if(res.code===0){
                setAgentList(res.data)
                const defaultAgent = res?.data.find(item=>item.businessType==='default')
                setDefaultAgent(defaultAgent.id)
            }
        })
    },[])

    useEffect(() => {
        if(agentVisible){
            form.setFieldsValue({
                agent: defaultAgent
            })
        }
    }, [agentVisible]);

    /**
     * 确定
     */
    const onOk = () => {
        form.validateFields().then(value=>{
            setDefaultAgent(value.agent);
            onCancel();
        })
    }

    /**
     * 关闭弹出框
     */
    const onCancel = () => {
        setAgentVisible(false)
    }

    return (
        <Modal
            title={'配置Agent'}
            visible={agentVisible}
            onCancel={onCancel}
            onOk={onOk}
        >
            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
            >
                <Form.Item
                    label={'Agent'}
                    name={'agent'}
                >
                    <Select
                        showSearch
                        onChange={value=>setDefaultAgent(value)}
                        filterOption = {(input, option) =>
                            (Array.isArray(option.children) ? option.children.join('') : option.children).toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {
                            agentList && agentList.map(item=>(
                                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}


export default DesignAgent
