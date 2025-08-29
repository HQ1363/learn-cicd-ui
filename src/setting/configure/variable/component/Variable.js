/**
 * @Description: 变量
 * @Author: gaomengyuan
 * @Date: 2025/7/23
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/7/23
 */
import React, {useEffect, useState} from "react";
import {Col, Row, Spin, Table} from "antd";
import BreadCrumb from "../../../../common/component/breadcrumb/BreadCrumb";
import Button from "../../../../common/component/button/Button";
import ListEmpty from "../../../../common/component/list/ListEmpty";
import ListIcon from "../../../../common/component/list/ListIcon";
import ListAction from "../../../../common/component/list/ListAction";
import "./Variable.scss";
import variableStore from "../store/VariableStore";
import Page from "../../../../common/component/page/Page";
import VariableModal from "./VariableModal";
import {deleteSuccessReturnCurrenPage} from "../../../../common/utils/Client";
import {PrivilegeButton} from "tiklab-privilege-ui";

const pageSize = 13;

const Variable = (props) => {

    const {findSystemVariablePage,deleteSystemVariable} = variableStore;

    //变量数据
    const [variableData,setVariableData] = useState({});
    //加载
    const [spinning,setSpinning] = useState(false);
    //弹出框状态
    const [visible,setVisible] = useState(false);
    //弹出框form表单value
    const [formValue,setFormValue] = useState(null);
    const pageParam = {
        pageSize:pageSize,
        currentPage: 1,
    }
    //请求数据
    const [requestParams,setRequestParams] = useState({
        pageParam
    });

    useEffect(()=>{
        //获取变量
        findVariable()
    },[requestParams])

    /**
     * 获取变量
     */
    const findVariable = () =>{
        setSpinning(true)
        findSystemVariablePage(requestParams).then(res=>{
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
    const changPage = page => {
        setRequestParams({
            ...requestParams,
            pageParam:{
                pageSize:pageSize,
                currentPage: page,
            }
        })
    }

    /**
     * 编辑变量
     * @param record
     */
    const editVariable = (record) => {
        setFormValue(record);
        setVisible(true);
    }

    /**
     * 删除变量
     */
    const delVariable = (record) => {
        deleteSystemVariable(record.id).then(res=>{
            if(res.code===0){
                const page = deleteSuccessReturnCurrenPage(variableData.totalRecord,pageSize,variableData.currentPage)
                changPage(page)
            }
        })
    }

    const columns = [
        {
            title:"名称",
            dataIndex:"varKey",
            key:"varKey",
            width:"25%",
            ellipsis:true,
            render:text => (
                <span>
                    <ListIcon text={text}/>
                    <span>{text}</span>
                </span>
            )
        },
        {
            title:"值",
            dataIndex:"varValue",
            key:"varValue",
            width:"25%",
            ellipsis:true,
        },
        {
            title:"创建方式",
            dataIndex:"type",
            key:"type",
            width:"15%",
            ellipsis:true,
            render:text => text===1?'内置':'自定义'
        },
        {
            title:"描述",
            dataIndex:"desc",
            key:"desc",
            width:"25%",
            ellipsis:true,
            render:text => text || "--"
        },
        {
            title:"操作",
            dataIndex: "action",
            key: "action",
            width:"10%",
            ellipsis:true,
            render:(_,record) => record?.type!==1 && (
                <ListAction
                    edit={()=>editVariable(record)}
                    del={()=>delVariable(record)}
                    isMore={true}
                    code={{
                        editCode: 'pipeline_variable_update',
                        delCode: 'pipeline_variable_delete',
                    }}
                />
            )
        }
    ]

    return (
        <Row className='variable-setting'>
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "18", offset: "3" }}
                xxl={{ span: "18", offset: "3" }}
            >
                <div className='arbess-home-limited'>
                    <BreadCrumb
                        crumbs={[
                            {title:'变量'}
                        ]}
                    >
                        <PrivilegeButton code={'pipeline_variable_add'}>
                            <Button
                                type={'primary'}
                                onClick={()=>setVisible(true)}
                            >
                                添加变量
                            </Button>
                        </PrivilegeButton>
                    </BreadCrumb>
                    <VariableModal
                        visible={visible}
                        setVisible={setVisible}
                        formValue={formValue}
                        setFormValue={setFormValue}
                        findVariable={findVariable}
                    />
                    <div className='variable-content'>
                        <Spin spinning={spinning}>
                            <Table
                                columns={columns}
                                dataSource={variableData?.dataList || []}
                                rowKey={record=>record.id}
                                pagination={false}
                                locale={{emptyText: <ListEmpty />}}
                            />
                            <Page
                                currentPage={requestParams.pageParam.currentPage}
                                changPage={changPage}
                                page={variableData}
                            />
                        </Spin>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default Variable
