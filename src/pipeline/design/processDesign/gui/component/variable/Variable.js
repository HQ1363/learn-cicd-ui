/**
 * @Description: 任务变量
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/11
 */
import React,{useEffect,useState} from "react";
import {inject,observer} from "mobx-react";
import {Input, Popconfirm, Select, Form, Spin} from "antd";
import {DeleteOutlined, CaretDownOutlined,CaretRightOutlined} from "@ant-design/icons";
import Button from "../../../../../../common/component/button/Button";
import ListEmpty from "../../../../../../common/component/list/ListEmpty";
import {Validation} from "../../../../../../common/utils/Client";
import "./Variable.scss";

const Variable = props => {

    const {variableStore,dataItem,pipeline,findCount,variableObj,setVariableObj} = props

    const {createVariable,findVariableList,deleteVariable, updateVariable} = variableStore;

    const [formVar] = Form.useForm();

    //变量数据
    const [variableData,setVariableData] = useState([]);
    //是否显示下拉框
    const [showArrow,setShowArrow] = useState(false);
    //加载
    const [spinning,setSpinning] = useState(false);

    useEffect(()=>{
        //获取变量
        findVariable("init")
    },[dataItem.taskId])

    /**
     * 获取变量
     */
    const findVariable = (mode) =>{
        setSpinning(true)
        findVariableList({
            taskId:dataItem.taskId,
            type:2
        }).then(res=>{
            if(res.code===0){
                setVariableData(res?.data || [])
                if(mode!=='init'){
                    findCount()
                }
            }
        }).finally(()=>{
            setSpinning(false)
        })
    }

    useEffect(()=>{
        //初始化表单
        if(!variableObj){
            return;
        }
        if(variableObj?.var==='edit'){
            formVar.setFieldsValue(variableObj)
        }
        if(variableObj?.var==='add'){
            formVar.resetFields()
        }
    },[variableObj])

    /**
     * 编辑变量
     */
    const editInput = (item) => {
        setVariableObj({
            var:"edit",
            varId:item.varId,
            varKey:item.varKey,
            varValue:item.varValue || "",
        })
    }

    /**
     * 删除变量
     */
    const reduceInput = (e,item) => {
        e.stopPropagation();
        deleteVariable(item.varId).then(res=>{
            if(res.code===0){
                findVariable()
            }
        })
    }

    /**
     * 取消编辑状态
     */
    const onCancel = () =>{
        setVariableObj(null);
    }

    /**
     * 确定添加或修改
     */
    const onOk = item =>{
        formVar.validateFields().then(async value => {
            const {varKey,varValue,varType} = value
            if(item && item.varKey===varKey && item.varValue===varValue && item.varType===varType){
                onCancel()
                return;
            }
            let res;
            if(variableObj.var==='add'){
                res = await createVariable({
                    type:2,
                    taskId:dataItem.taskId,
                    pipelineId: pipeline.id,
                    ...value,
                })
            } else {
                res = await updateVariable({
                    type:2,
                    varId:variableObj.varId,
                    pipelineId: pipeline.id,
                    ...value
                })
            }
            if(res.code===0){
                onCancel()
                findVariable()
            }
        })
    }

    //表单
    const inputHtml = item =>{
        return (
            <Form
                form={formVar}
                layout={"vertical"}
                autoComplete={"off"}
                initialValues={{varType:"str"}}
            >
                <Form.Item
                    label={'变量名'}
                    name={'varKey'}
                    rules={[
                        {required:true,message:"变量名不能为空"},
                        Validation("变量名"),
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label={'类别'}
                    name={'varType'}
                    rules={[{required:true,message:"变量名不能为空"}]}
                >
                    <Select
                        showArrow={showArrow}
                        onMouseEnter={()=>setShowArrow(true)}
                        onMouseLeave={()=>setShowArrow(false)}
                    >
                        <Select.Option value={"str"}>字符串</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label={'变量'}
                    name={'varValue'}
                    rules={[
                        {required:true,message:"变量名不能为空"},
                    ]}
                >
                    <Input/>
                </Form.Item>
                <div className="inputs-variable-btn">
                    <Button onClick={()=>onCancel()} title={"取消"} isMar={true}/>
                    <Button onClick={()=>onOk(item)} title={"保存"} type={"primary"}/>
                </div>
            </Form>
        )
    }

    const renderInputs = (item,index) =>{
        return(
            <div key={index} className="pose-variable-inputs">
                <div className="inputs-variable"
                     onClick={()=>variableObj?.varId === item.varId ? onCancel() : editInput(item)}
                >
                    <div className="inputs-variable-icon">
                    {
                        variableObj?.varId === item.varId ?
                            <CaretDownOutlined />
                            :
                            <CaretRightOutlined />
                    }
                    </div>
                    <div className="inputs-variable-varKey">{item && item.varKey}</div>
                    <div className="inputs-variable-opt">
                        <span data-title-bottom={"删除"} onClick={e=>e.stopPropagation()}>
                            <Popconfirm
                                placement="bottomRight"
                                title={"你确定删除吗"}
                                okText="确定"
                                cancelText="取消"
                                onConfirm={e=>reduceInput(e,item)}
                            >
                                <DeleteOutlined />
                             </Popconfirm>
                        </span>
                    </div>
                </div>
                {
                    variableObj?.varId === item.varId &&
                    <div className="inputs-variable-html">
                        { inputHtml(item) }
                    </div>
                }
            </div>
        )
    }

    return(
        <div className="pose-variable">
            <div className="pose-variable-content">
                {variableObj?.var==='add' &&  <div className='add-title'>添加变量</div>}
                {variableObj?.var==='add' && inputHtml()}
                <Spin spinning={spinning}>
                    {
                        variableData && variableData.length>0 ?
                            variableData.map((item,index)=>renderInputs(item,index))
                            :
                            <ListEmpty />
                    }
                </Spin>
            </div>
        </div>
    )
}

export default inject("variableStore")(observer(Variable))
