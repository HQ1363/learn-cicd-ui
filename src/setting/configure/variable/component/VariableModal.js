/**
 * @Description: 变量添加与编辑
 * @Author: gaomengyuan
 * @Date: 2025/7/23
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/7/23
 */
import React,{useEffect} from "react";
import {Form, Input} from "antd";
import {Validation} from "../../../../common/utils/Client";
import Modals from "../../../../common/component/modal/Modal";
import variableStore from "../store/VariableStore";

const VariableModal = (props) => {

    const {visible,setVisible,formValue,setFormValue,findVariable} = props

    const {createSystemVariable,updateSystemVariable} = variableStore;

    const [form] = Form.useForm();

    useEffect(() => {
        if(visible && formValue){
            form.setFieldsValue(formValue)
        }
    }, [visible]);

    /**
     * 确定添加或者更新
     */
    const onOk = () =>{
        form.validateFields().then((values) => {
            if(formValue){
                updateSystemVariable({
                    id:formValue.id,
                    ...values
                }).then(r=>{
                    if(r.code===0){
                        findVariable()
                    }
                })
            } else {
                createSystemVariable({
                    ...values,
                    type: 2
                }).then(r=>{
                    if(r.code===0){
                        findVariable()
                    }
                })
            }
            onCancel()
        })
    }

    /**
     * 关闭弹出框
     */
    const onCancel = () => {
        form.resetFields();
        setVisible(false);
        setFormValue(null);
    }

    return (
        <Modals
            visible={visible}
            onCancel={onCancel}
            onOk={onOk}
            title={formValue?"修改":"添加"}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="varKey"
                    label="名称"
                    rules={[{required:true,message:`名称不能空`},Validation("名称")]}
                >
                    <Input placeholder={'名称'}/>
                </Form.Item>
                <Form.Item
                    name="varValue"
                    label="值"
                    rules={[{required:true,message:`值不能空`},Validation("值")]}
                >
                    <Input placeholder={'值'}/>
                </Form.Item>
                <Form.Item
                    name="desc"
                    label="描述"
                >
                    <Input placeholder={'描述'}/>
                </Form.Item>
            </Form>
        </Modals>
    )

}

export default VariableModal;
