/**
 * @Description: 流水线信息
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React,{useState} from "react";
import {Row, Col, Modal, Spin} from "antd";
import {
    DeleteOutlined,
    DownOutlined,
    RightOutlined,
    EditOutlined,
    ClearOutlined
} from "@ant-design/icons";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import {inject,observer} from "mobx-react";
import PipelineAddInfo from "../../pipeline/components/PipelineAddInfo";
import PipelineDelete from "../../pipeline/components/PipelineDelete";
import BreadCrumb from "../../../common/component/breadcrumb/BreadCrumb";
import Button from "../../../common/component/button/Button";
import historyStore from "../../history/store/HistoryStore";
import "./BasicInfo.scss";

const BasicInfo = props =>{

    const {pipelineStore} = props;

    const {pipeline,setPipeline}=pipelineStore;
    const {clean} = historyStore;

    //树的展开与闭合
    const [expandedTree,setExpandedTree] = useState([]);
    //删除弹出框
    const [delVisible,setDelVisible] = useState(false);
    //加载
    const [spinning,setSpinning] = useState(false);

    /**
     * 是否符合要求
     * @param key
     * @returns {boolean}
     */
    const isExpandedTree = key => {
        return expandedTree.some(item => item ===key)
    }

    /**
     * 展开和闭合
     * @param key
     */
    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
            // false--闭合
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            // ture--展开
            setExpandedTree(expandedTree.concat(key))
        }
    }

    /**
     * 清理流水线缓存
     */
    const clearPipeline = () => {
        Modal.confirm({
            title: '确定清理吗？',
            content: <span style={{color:"#f81111"}}>当前操作会清理流水线的缓存，包括已拉取的源码、依赖等，已执行的历史制品不会被清除！</span>,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                setSpinning(true);
                clean(pipeline.id).finally(()=>{
                    setSpinning(false)
                })
            },
            onCancel() {
            },
        })
    }

    const lis = [
        {
            key: 'info',
            title:"流水线信息",
            desc: "更新流水线信息",
            icon: <EditOutlined />,
            enCode:"pipeline_update",
            content: (
                <div className="bottom-rename">
                    <PipelineAddInfo
                        {...props}
                        set={true}
                        pipeline={pipeline}
                        setPipeline={setPipeline}
                        onClick={()=>setOpenOrClose('info')}
                    />
                </div>
            )
        },
        {
            key: 'clear',
            title: "流水线清理",
            desc: "清理流水线缓存",
            icon: <ClearOutlined />,
            content: (
                <div className='bottom-clear'>
                    <div style={{color:"#ff0000",paddingBottom:5,fontSize:13}}>
                        当前操作会清理流水线的缓存，包括已拉取的源码、依赖等，已执行的历史制品不会被清除！
                    </div>
                    <Button
                        onClick={()=>setOpenOrClose('clear')}
                        title={"取消"}
                        isMar={true}
                    />
                    <PrivilegeProjectButton code={"pip_setting_clean"} domainId={pipeline && pipeline.id}>
                        <Button
                            onClick={clearPipeline}
                            type={"dangerous"}
                            title={"清理"}
                        />
                    </PrivilegeProjectButton>
                </div>
            )
        },
        {
            key:'delete',
            title:"流水线删除",
            desc: "删除流水线",
            icon: <DeleteOutlined />,
            enCode: "pipeline_delete",
            content: (
                <div className="bottom-delete">
                    <div style={{color:"#ff0000",paddingBottom:5,fontSize:13}}>
                        此操作无法恢复！请慎重操作！
                    </div>
                    <Button
                        onClick={()=>setOpenOrClose('delete')}
                        title={"取消"}
                        isMar={true}
                    />
                    <PrivilegeProjectButton code={"pip_setting_delete"} domainId={pipeline && pipeline.id}>
                        <Button
                            onClick={()=>setDelVisible(true)}
                            type={"dangerous"}
                            title={"删除"}
                        />
                    </PrivilegeProjectButton>
                </div>
            )
        },
    ]

    return(
        <Row className="pipelineReDel">
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "16", offset: "4" }}
                xxl={{ span: "14", offset: "5" }}
            >
                <div className="arbess-home-limited">
                    <div className="pipelineReDel-up">
                        <BreadCrumb
                            crumbs={[
                                {title:'流水线信息'},
                            ]}
                        />
                    </div>
                    <div className="pipelineReDel-content">
                        <Spin spinning={spinning}>
                            <div className="pipelineReDel-ul">
                                {
                                    lis.map(item=> (
                                        <div key={item.key} className="pipelineReDel-li">
                                            <div className={`pipelineReDel-li-top ${isExpandedTree(item.key) ?"pipelineReDel-li-select":"pipelineReDel-li-unSelect"}`}
                                                 onClick={()=>setOpenOrClose(item.key)}
                                            >
                                                <div className="pipelineReDel-li-icon">{item.icon}</div>
                                                <div className="pipelineReDel-li-center">
                                                    <div className="pipelineReDel-li-title">{item.title}</div>
                                                    {
                                                        !isExpandedTree(item.key) &&
                                                        <div className="pipelineReDel-li-desc">{item.desc}</div>
                                                    }
                                                </div>
                                                <div className="pipelineReDel-li-down">
                                                    { isExpandedTree(item.key)? <DownOutlined />:<RightOutlined /> }
                                                </div>
                                            </div>
                                            <div className={`${isExpandedTree(item.key)? "pipelineReDel-li-bottom":"pipelineReDel-li-none"}`}>
                                                { isExpandedTree(item.key) && item.content }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </Spin>
                    </div>
                </div>
                <PipelineDelete
                    {...props}
                    pipeline={pipeline}
                    delVisible={delVisible}
                    setDelVisible={setDelVisible}
                />
            </Col>
        </Row>
    )
}

export default inject("pipelineStore")(observer(BasicInfo))
