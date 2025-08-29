/**
 * @Description: sourcefare 扫描
 * @Author: gaomengyuan
 * @Date: 2025/5/26
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/5/26
 */
import React,{useState,useEffect} from "react";
import {Row, Col, Spin, Divider, Table} from "antd";
import BreadCrumb from "../../../../common/component/breadcrumb/BreadCrumb";
import Page from "../../../../common/component/page/Page";
import ListEmpty from "../../../../common/component/list/ListEmpty";
import ListAction from "../../../../common/component/list/ListAction";
import {deleteSuccessReturnCurrenPage} from "../../../../common/utils/Client";
import sourceFareScanStore from "../store/SourceFareScanStore";
import "./SourceFareScan.scss";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";

const pageSize = 15;

const SourceFareScan = (props) => {

    const {match:{params}} = props;

    const {findSourceFareScanPage,deleteSourceFareScan} = sourceFareScanStore;

    //代码扫描数据
    const [scanData,setScanData] = useState({});
    //加载
    const [spinning,setSpinning] = useState(false);
    const pageParam = {
        pageSize: pageSize,
        currentPage: 1,
    };
    //请求数据
    const [scanParam,setScanParam] = useState({pageParam});

    useEffect(() => {
        //获取sourcefare
        findSourceFareScan()
    }, [scanParam]);

    /**
     * 获取sourcefare
     */
    const findSourceFareScan = () => {
        setSpinning(true)
        findSourceFareScanPage({
            pipelineId:params.id,
            ...scanParam,
        }).then(res=>{
            if(res.code===0){
                setScanData(res.data)
            }
        }).finally(()=>setSpinning(false))
    }

    /**
     * 换页
     * @param page
     */
    const changPage = page => {
        setScanParam({
            pageParam:{
                pageSize: pageSize,
                currentPage: page
            }
        })
    }

    /**
     * 删除SourceFare
     */
    const delSourceFare = record =>{
        deleteSourceFareScan(record.id).then(res=>{
            if(res.code===0){
                const current = deleteSuccessReturnCurrenPage(scanData.totalRecord, pageSize, scanData.currentPage)
                changPage(current)
            }
        })
    }

    /**
     * 跳转详情
     */
    const goSourceFare = (record) => {
        window.open(`${record.url}`)
    }

    const columns = [
        {
            title: "名称",
            dataIndex: "id",
            key: "id",
            width:"65%",
            ellipsis:true,
            render:(text,record) =>{
                const {  status, allTrouble, severityTrouble, noticeTrouble, suggestTrouble } = record;
                return (
                    <div className='data-item-left'>
                        <span className='data-item-name' onClick={()=>goSourceFare(record)}>
                            # {text || '--'}
                        </span>
                        {
                            status==='success' &&
                            <CheckCircleOutlined className='success-text'/>
                        }
                        {
                            status==='fail' &&
                            <CloseCircleOutlined className='fail-text'/>
                        }
                        <div className='data-item-count'>
                            <div className='data-item-pass'>
                                <span className='count-key'>总数</span>
                                {allTrouble}
                            </div>
                            <Divider type="vertical" />
                            <div className='data-item-pass'>
                                <span className='count-key'>严重问题</span>
                                {severityTrouble}
                            </div>
                            <Divider type="vertical" />
                            <div className='data-item-pass'>
                                <span className='count-key'>警告问题</span>
                                {noticeTrouble}
                            </div>
                            <Divider type="vertical" />
                            <div className='data-item-fail'>
                                <span className='count-key'>提示问题</span>
                                {suggestTrouble}
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            title: "扫描时间",
            dataIndex: "createTime",
            key: "createTime",
            width:"27%",
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
                <PrivilegeProjectButton domainId={params.id} code={'pip_test_report_sourcefare_delete'}>
                    <ListAction
                        del={()=>delSourceFare(record)}
                        isMore={true}
                    />
                </PrivilegeProjectButton>
            )
        }
    ]

    return (
        <Row className='sourcefare'>
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
                            {title:'代码扫描'},
                            {title:'SourceFare'}
                        ]}
                    />
                    <Spin spinning={spinning}>
                        <div className="sourcefare-table">
                            <Table
                                bordered={false}
                                columns={columns}
                                dataSource={scanData?.dataList || []}
                                rowKey={record=>record.id}
                                pagination={false}
                                locale={{emptyText: <ListEmpty />}}
                            />
                            <Page
                                currentPage={scanData?.currentPage}
                                changPage={changPage}
                                page={scanData}
                            />
                        </div>
                    </Spin>
                </div>
            </Col>
        </Row>
    )
}

export default SourceFareScan
