/**
 * @Description: 流水线信息
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React,{useState} from "react";
import {Input, Spin,Row,Col} from "antd";
import {
    DeleteOutlined,
    DownOutlined,
    RightOutlined,
    EditOutlined
} from "@ant-design/icons";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import {inject,observer} from "mobx-react";
import PipelineAddInfo from "../../pipeline/components/PipelineAddInfo";
import PipelineDelete from "../../pipeline/components/PipelineDelete";
import BreadCrumb from "../../../common/component/breadcrumb/BreadCrumb";
import Button from "../../../common/component/button/Button";
import "./BasicInfo.scss";

const BasicInfo = props =>{

    const {pipelineStore} = props

    const {pipeline,setPipeline}=pipelineStore

    //树的展开与闭合
    const [expandedTree,setExpandedTree] = useState([])
    //删除弹出框
    const [delVisible,setDelVisible] = useState(false)

    const lis = [
        {
            key:1,
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
                        onClick={()=>setOpenOrClose(1)}
                    />
                </div>
            )
        },
        {
            key:2,
            title:"流水线删除",
            desc: "删除流水线",
            icon: <DeleteOutlined />,
            enCode:"pipeline_delete",
            content: (
                <div className="bottom-delete">
                    <div style={{color:"#ff0000",paddingBottom:5,fontSize:13}}>
                        此操作无法恢复！请慎重操作！
                    </div>
                    <Button
                        onClick={()=>setOpenOrClose(2)}
                        title={"取消"}
                        isMar={true}
                    />
                    <PrivilegeProjectButton code={"pipeline_delete"} domainId={pipeline && pipeline.id}>
                        <Button
                            onClick={()=>setDelVisible(true)}
                            type={"dangerous"}
                            title={"删除"}
                        />
                    </PrivilegeProjectButton>
                </div>
            )
        }
    ]

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

    const lisItem = item =>{
        return <div key={item.key} className="pipelineReDel-li">
            <div className={`pipelineReDel-li-top ${isExpandedTree(item.key) ?"pipelineReDel-li-select":""}`}
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
    }

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
                        <div className="pipelineReDel-ul">
                            {
                                lis.map(item=> lisItem(item))
                            }
                        </div>
                    </div>
                </div>
                <PipelineDelete
                    pipeline={pipeline}
                    delVisible={delVisible}
                    setDelVisible={setDelVisible}
                />
            </Col>
        </Row>
    )
}

export default inject("pipelineStore")(observer(BasicInfo))
