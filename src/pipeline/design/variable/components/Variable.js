/**
 * @Description: 变量
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/28
 */
import React,{useState,useEffect} from "react";
import {Row, Col, Table, Spin} from "antd";
import {inject,observer} from "mobx-react";
import Button from "../../../../common/component/button/Button";
import ListEmpty from "../../../../common/component/list/ListEmpty";
import ListAction from "../../../../common/component/list/ListAction";
import VariableAddEdit from "./VariableAddEdit";
import "./Variable.scss";
import {pipeline_task_update} from "../../../../common/utils/Constant";
import Page from "../../../../common/component/page/Page";
import {deleteSuccessReturnCurrenPage} from "../../../../common/utils/Client";
import VersionInfo from "../../../../common/component/versionInfo/VersionInfo";

const pageSize = 13;

const Variable = props =>{

    const {findCount,taskStore,variableStore,match} = props

    const {findVariablePage,deleteVariable} = variableStore;
    const {taskPermissions} = taskStore;
    const pageParam = {
        pageSize: pageSize,
        currentPage: 1,
    }
    //弹出框
    const [variableVisible,setVariableVisible] = useState(false);
    //编辑内容
    const [formValue,setFormValue] = useState(null);
    //变量数据
    const [variableData,setVariableData] = useState([]);
    //加载
    const [spinning,setSpinning] = useState(false);
    //请求数据
    const [requestParam,setRequestParam] = useState({pageParam})
    //流水线更新
    const taskUpdate = taskPermissions?.includes(pipeline_task_update);
    //流水线id
    const pipelineId = match.params.id;

    useEffect(() => {
        //获取变量
        findVariable();
    }, [requestParam]);

    /**
     * 获取变量
     */
    const findVariable = () =>{
        setSpinning(true)
        findVariablePage({
            pipelineId,
            type:1,
            ...requestParam
        }).then(res=>{
            if(res.code===0){
                setVariableData(res.data)
            }
        }).finally(()=>{
            setSpinning(false)
        })
    }

    /**
     * 换页
     */
    const changPage = (page) => {
        setRequestParam({
            ...requestParam,
            pageParam: {
                currentPage: page,
                pageSize: pageSize
            }
        })
    }

    /**
     * 添加变量
     */
    const addVariable = () =>{
        setVariableVisible(true)
    }

    /**
     * 编辑变量
     * @param record
     */
    const editVariable = record =>{
        setFormValue(record)
        setVariableVisible(true)
    }

    /**
     * 删除变量
     * @param record
     */
    const delVariable = record =>{
        deleteVariable(record.varId).then(res=>{
            if(res.code===0){
                const page = deleteSuccessReturnCurrenPage(variableData.totalRecord,pageSize,variableData.currentPage)
                changPage(page)
                findCount()
            }
        })
    }

    const columns = [
        {
            title: "变量名",
            dataIndex: "varKey",
            key: "varKey",
            width:"40%",
            ellipsis:true,
        },
        {
            title: "类别",
            dataIndex: "varType",
            key: "varType",
            width:"20%",
            ellipsis:true,
            render:text => text==="str"?"字符串":"单选"
        },
        {
            title: "默认值",
            dataIndex: "varValue",
            key: "varValue",
            width:"30%",
            ellipsis:true,
        },
        taskUpdate ? {
            title: "操作",
            dataIndex: "action",
            key: "action",
            width:"10%",
            ellipsis:true,
            render:(_,record) => (
                <ListAction
                    edit={()=>editVariable(record)}
                    del={()=>delVariable(record)}
                    isMore={true}
                />
            )
        } : {width:0},
    ]

    return(
        <Row className="design-content">
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "18", offset: "3" }}
                xxl={{ span: "16", offset: "4" }}
                className="variable"
            >
                <div className='variable-box'>
                    <div className="variable-up">
                        <div className="variable-up-num">
                            共{variableData?.totalRecord||0}条
                        </div>
                        { taskUpdate && <Button title={"添加"} onClick={addVariable}/> }
                        <VariableAddEdit
                            {...props}
                            findVariable={findVariable}
                            findCount={findCount}
                            variableData={variableData}
                            variableVisible={variableVisible}
                            setVariableVisible={setVariableVisible}
                            formValue={formValue}
                            setFormValue={setFormValue}
                            pipelineId={pipelineId}
                        />
                    </div>
                    <div className='variable-content'>
                        <Spin spinning={spinning}>
                            <div className={`variable-tables ${variableData?.totalRecord > 0 ? '' : 'variable-tables-empty'}`}>
                                <Table
                                    bordered={false}
                                    columns={columns}
                                    dataSource={variableData?.dataList || []}
                                    rowKey={record=>record.varId}
                                    pagination={false}
                                    locale={{emptyText: <ListEmpty />}}
                                />
                                <Page
                                    currentPage={variableData.currentPage}
                                    changPage={changPage}
                                    page={variableData}
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

export default inject("variableStore","taskStore")(observer(Variable))
