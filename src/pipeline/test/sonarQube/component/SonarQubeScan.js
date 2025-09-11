/**
 * @Description: SonarQube 扫描
 * @Author: gaomengyuan
 * @Date: 2025/5/26
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/5/26
 */
import React,{useState,useEffect} from "react";
import {Row, Col, Spin, Divider, Table, Tooltip} from "antd";
import BreadCrumb from "../../../../common/component/breadcrumb/BreadCrumb";
import Page from "../../../../common/component/page/Page";
import ListEmpty from "../../../../common/component/list/ListEmpty";
import ListAction from "../../../../common/component/list/ListAction";
import {deleteSuccessReturnCurrenPage} from "../../../../common/utils/Client";
import sonarQubeScanStore from "../store/SonarQubeScanStore";
import "./SonarQubeScan.scss";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    QuestionCircleOutlined
} from "@ant-design/icons";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";

const pageSize = 10;

const SonarQubeScan = (props) => {

    const {match:{params}} = props;

    const {findSonarQubeScanPage,deleteSonarQubeScan} = sonarQubeScanStore;

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
        //获取SonarQube
        findSonarQubeScan()
    }, [scanParam]);

    /**
     * 获取SonarQube
     */
    const findSonarQubeScan = () =>{
        setSpinning(true)
        findSonarQubeScanPage({
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
     * 删除SonarQube
     */
    const delSonarQube = record =>{
        deleteSonarQubeScan(record.id).then(res=>{
            if(res.code===0){
                const current = deleteSuccessReturnCurrenPage(scanData.totalRecord, pageSize, scanData.currentPage)
                changPage(current)
            }
        })
    }

    /**
     * 跳转详情
     */
    const goSonarQube = (record) => {
        window.open(`${record.url}`)
    }

    const columns = [
        {
            title: "名称",
            dataIndex: "id",
            key: "id",
            width:"34%",
            ellipsis:true,
            render:(text,record) =>{
                const { id, status } = record;
                return (
                    <div className='data-item-left'>
                        <span className='data-item-name' onClick={()=>goSonarQube(record)}>
                            # {id || '--'}
                        </span>
                        {
                            status==='OK' &&
                                <CheckCircleOutlined className='success-text'/>
                        }
                        {
                            status==='ERROR' &&
                                <CloseCircleOutlined className='fail-text'/>
                        }
                        {
                            status==='WARN' &&
                                <ExclamationCircleOutlined className='warn-text'/>
                        }
                        {
                            status==='NONE' &&
                                <QuestionCircleOutlined className='warn-text'/>
                        }
                    </div>
                )
            }
        },
        {
            title: "扫描信息",
            dataIndex: "allTrouble",
            key: "allTrouble",
            width:"33%",
            ellipsis:true,
            render:(text,record)=>{
                const {  ncloc, files, bugs, loophole } = record;
                return (
                    <Tooltip
                        title={
                            <div>
                                <div className='data-item-count-tip'>
                                    <div className='data-item-count-tip-key'>代码行数</div>
                                    <div>{ncloc}</div>
                                </div>
                                <div className='data-item-count-tip'>
                                    <div className='data-item-count-tip-key'>文件数量</div>
                                    <div>{files}</div>
                                </div>
                                <div className='data-item-count-tip'>
                                    <div className='data-item-count-tip-key'>Bug数量</div>
                                    <div>{bugs}</div>
                                </div>
                                <div className='data-item-count-tip'>
                                    <div className='data-item-count-tip-key'>漏洞数量</div>
                                    <div>{loophole}</div>
                                </div>
                            </div>
                        }
                    >
                        <div className='data-item-count'>
                            <div className={`data-item-pass ${ncloc > 0 ? 'text-ncloc': ''}`}>
                                {ncloc}
                            </div>
                            <Divider type="vertical" />
                            <div className={`data-item-pass ${files > 0 ? 'text-files': ''}`}>
                                {files}
                            </div>
                            <Divider type="vertical" />
                            <div className={`data-item-pass ${bugs > 0 ? 'text-bugs': ''}`}>
                                {bugs}
                            </div>
                            <Divider type="vertical" />
                            <div className={`data-item-pass ${loophole > 0 ? 'text-loophole': ''}`}>
                                {loophole}
                            </div>
                        </div>
                    </Tooltip>
                )
            }
        },
        {
            title: "扫描时间",
            dataIndex: "createTime",
            key: "createTime",
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
                <PrivilegeProjectButton domainId={params.id} code={'pip_test_report_sonarqube_delete'}>
                    <ListAction
                        del={()=>delSonarQube(record)}
                        isMore={true}
                    />
                </PrivilegeProjectButton>
            )
        }
    ]

    return (
        <Row className='sonarquebe'>
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
                            {title:'SonarQube'}
                        ]}
                    />
                    <Spin spinning={spinning}>
                        <div className="sonarquebe-table">
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

export default SonarQubeScan
