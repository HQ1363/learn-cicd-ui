/**
 * @Description: 工具配置
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React,{useEffect,useState} from "react";
import {Row, Col} from "antd";
import BreadCrumb from "../../../../common/component/breadcrumb/BreadCrumb";
import "./Tool.scss";
import {scmTitle, scmImage} from "./ToolCommon";
import {RightOutlined} from "@ant-design/icons";
import {
    toolCAdd,
    toolGit,
    toolGo,
    toolJdk,
    toolK8s,
    toolMaven,
    toolNetCore,
    toolNode,
    toolPhp,
    toolPython,
    toolSonarScanner,
    toolSourceFareScanner,
    toolSvn
} from "../../../../common/utils/Constant";
import toolStore from "../store/ToolStore";

const scmList = [
    {
        title: '源码',
        list: [
            toolGit,
            toolSvn,
        ],
    },
    {
        title: '构建',
        list: [
            toolJdk,
            toolMaven,
            toolNode,
            toolGo,
            toolPython,
            toolPhp,
            toolNetCore,
            toolCAdd,
        ],
    },
    {
        title: '代码扫描',
        list: [
            toolSourceFareScanner,
            toolSonarScanner,
        ],
    },
    {
        title: 'Kubernetes',
        list: [
            toolK8s,
        ],
    },
]

const Tool = props =>{

    const {findScmByTypeGroup} = toolStore;

    const [toolGroup,setToolGroup] = useState([]);

    useEffect(() => {
        findScmByTypeGroup().then(res=>{
            if(res.code===0){
                setToolGroup(res?.data || [])
            }
        })
    }, []);

    const ToolHtml = (key) => {
        const item = toolGroup?.find(item=>item.scm_type===key);
        return `共${item?.number || '0'}条`
    }

    return (
        <Row className="tool">
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "20", offset: "2" }}
                xl={{ span: "16", offset: "4" }}
                xxl={{ span: "16", offset: "4" }}
            >
                <div className="arbess-home-limited">
                    <BreadCrumb
                        crumbs={[
                            {title:'工具集成'}
                        ]}
                    >
                    </BreadCrumb>
                    <div className='tool-content'>
                        {
                            scmList.map(({title,list})=>(
                                <div key={title} className='tool-list'>
                                    <div className='tool-ul-title'>
                                        {title}
                                    </div>
                                    <div className="tool-ul">
                                        {
                                            list.map(key=> (
                                                <div key={key} className="tool-li" onClick={()=>props.history.push(`/setting/tool/${key}`)}>
                                                    <div className="tool-li-icon">
                                                        <img src={scmImage[key]} alt={''} width={18} height={18}/>
                                                    </div>
                                                    <div className="tool-li-center">
                                                        <div className="tool-li-title">
                                                            {scmTitle[key]}
                                                        </div>
                                                        <div className="tool-li-desc">
                                                            {ToolHtml(key)}
                                                        </div>
                                                    </div>
                                                    <div className="tool-li-down">
                                                        <RightOutlined />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default Tool
