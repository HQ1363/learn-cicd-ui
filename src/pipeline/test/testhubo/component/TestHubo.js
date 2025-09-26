/**
 * @Description: 流水线TestHubo自动化测试
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React,{useState,useEffect} from "react";
import {message, Row, Col, Divider, Spin, Table} from "antd";
import BreadCrumb from "../../../../common/component/breadcrumb/BreadCrumb";
import ListEmpty from "../../../../common/component/list/ListEmpty";
import Page from "../../../../common/component/page/Page";
import {deleteSuccessReturnCurrenPage} from "../../../../common/utils/Client";
import ListAction from "../../../../common/component/list/ListAction";
import testhuboStore from "../store/TestHuboStore";
import "./TestHubo.scss";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";

const pageSize = 10;

const TestHubo = props => {

    const {match:{params}} = props

    const {findRelevancePage,deleteRelevance} = testhuboStore;

    //加载状态
    const [isLoading,setIsLoading] = useState(false);
    //测试数据
    const [testData,setTestData] = useState({});
    const pageParam= {
        pageSize:pageSize,
        currentPage: 1,
    }
    //请求数据
    const [param,setParam] = useState({
        pageParam
    })

    useEffect(()=>{
        //获取测试列表
        findRelevance()
    },[param])

    /**
     * 获取测试列表
     */
    const findRelevance = () => {
        setIsLoading(true);
        findRelevancePage({
            pipelineId:params.id,
            ...param
        }).then(Res=>{
            if(Res.code===0){
                setTestData(Res.data)
            }
        }).finally(()=>setIsLoading(false))
    }

    /**
     * 查看测试详情
     * @param item
     */
    const goTestHubo = item => {
        if(item.status===2){
            return message.info("当前测试报告详情已删除")
        }
        return window.open(`${item.url}`)
    }

    /**
     * 删除自动化测试
     * @param item
     */
    const delTestHubo = (item) => {
        deleteRelevance(item.relevanceId).then(res=>{
            if(res.code===0){
                const current = deleteSuccessReturnCurrenPage(testData.totalRecord,pageSize,param.pageParam.currentPage)
                changPage(current)
            }
        })
    }

    /**
     * 换页
     * @param page
     */
    const changPage = page => {
        setParam({
            pageParam:{
                pageSize:pageSize,
                currentPage: page
            }
        })
    }

    const columns = [
        {
            title: "测试计划",
            dataIndex: "testonId",
            key: "testonId",
            width:"37%",
            ellipsis:true,
            render:(text,record) =>{
                const {execStatus,status} = record;
                return (
                    <div className='data-item-left'>
                        <span
                            className={`${text ? 'data-item-name' : 'data-item-name-ban'}`}
                            onClick={()=>text ? goTestHubo(record) : undefined}
                        >
                            # {text || '--'}
                        </span>
                        {
                            execStatus==='success' &&
                            <CheckCircleOutlined className='success-text'/>
                        }
                        {
                            execStatus==='fail' &&
                            <CloseCircleOutlined className='fail-text'/>
                        }
                    </div>
                )
            }
        },
        {
            title: "测试信息",
            dataIndex: "passNum",
            key: "passNum",
            width:"30%",
            ellipsis:true,
            render:(text,record) => {
                const { passNum, failNum } = record;
                return (
                    <div className='data-item-count'>
                        <div className='data-item-pass'>
                            <span className='count-key'>成功数</span>
                            {passNum || '0'}
                        </div>
                        <Divider type="vertical" />
                        <div className='data-item-pass'>
                            <span className='count-key'>失败数</span>
                            {failNum || '0'}
                        </div>
                    </div>
                )
            }
        },
        {
            title: "执行时间",
            dataIndex: "time",
            key: "time",
            width:"25%",
            ellipsis:true,
            render:text=>text || '--'
        },
        {
            title: "操作",
            dataIndex: "action",
            key:"action",
            width:"8%",
            ellipsis:true,
            render:(_,record)=> (
                <PrivilegeProjectButton domainId={params.id} code={'pip_test_report_testhubo_delete'}>
                    <ListAction
                        del={()=>delTestHubo(record)}
                        isMore={true}
                    />
                </PrivilegeProjectButton>
            )
        }
    ]

    return (
        <Row className='test-hubo'>
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "21", offset: "1" }}
                xxl={{ span: "18", offset: "3" }}
            >
                <div className="arbess-home-limited">
                    <BreadCrumb
                        crumbs={[
                            {title:'自动化测试'},
                            {title:'PostIn'}
                        ]}
                    />
                   <Spin spinning={isLoading}>
                       <div className='test-table'>
                           <Table
                               bordered={false}
                               pagination={false}
                               columns={columns}
                               dataSource={testData?.dataList || []}
                               rowKey={record=>record.relevanceId}
                               locale={{emptyText: <ListEmpty />}}
                           />
                           <Page
                               currentPage={param.pageParam.currentPage}
                               changPage={changPage}
                               page={testData}
                           />
                       </div>
                   </Spin>
                </div>
            </Col>
        </Row>
    )
}

export default TestHubo
