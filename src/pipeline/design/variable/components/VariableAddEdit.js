/**
 * @Description: 变量添加编辑
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/6/3
 */
import React,{useState,useEffect} from "react";
import {Form,Input,Select} from "antd";
import Modals from "../../../../common/component/modal/Modal";
import {Validation} from "../../../../common/utils/Client";

const VariableAddEdit = props =>{

    const {
        findVariable,variableVisible,setVariableVisible,formValue,setFormValue,pipelineId,variableData,
        variableStore,findCount
    } = props

    const {createVariable,updateVariable} = variableStore

    const [form] = Form.useForm()

    useEffect(()=>{
        if(variableVisible){
            // 表单初始
            if(formValue){
                form.setFieldsValue({
                    ...formValue,
                    valueList:formValue.varType==="str"?[formValue.varValue]:formValue.valueList
                })
                return
            }
            form.resetFields()
        }
    },[variableVisible])

    /**
     * 变量添加编辑确定
     */
    const onOk = () =>{
        form.validateFields().then(async (values)=>{
            let res;
            if(formValue){
                res = await updateVariable({
                    ...values,
                    type:1,
                    varId:formValue.varId
                })
            } else {
                res = await createVariable({
                    ...values,
                    type:1,
                    pipelineId: pipelineId,
                })
            }
            if(res.code===0){
                findVariable()
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
        setVariableVisible(false);
    }

    return(
        <Modals
            visible={variableVisible}
            onCancel={onCancel}
            onOk={onOk}
            width={500}
            title={formValue?"修改":"添加"}
        >
            <div className="variable-modal">
                <Form
                    form={form}
                    layout={"vertical"}
                    autoComplete={"off"}
                    initialValues={{valueList:[""],varType:"str"}}
                >
                    <Form.Item
                        name="varKey"
                        label="变量名"
                        rules={[
                            {required:true,message:"变量名不能为空"},
                            Validation("变量名"),
                        ]}
                    >
                        <Input placeholder="变量名"/>
                    </Form.Item>
                    <Form.Item name="varType" label="类别" rules={[{required:true,message:"类别不能为空"}]}>
                        <Select>
                            <Select.Option value={"str"}>字符串</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="varValue" label="默认值" rules={[{required:true,message:"默认值不能为空"}]}>
                        <Input  placeholder="默认值"/>
                    </Form.Item>
                </Form>
            </div>
        </Modals>
    )
}

export default VariableAddEdit
