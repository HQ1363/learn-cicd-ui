/**
 * @Description: 服务集成
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React,{useEffect,useState} from "react";
import {Row, Col} from "antd";
import BreadCrumb from "../../../../common/component/breadcrumb/BreadCrumb";
import "./Server.scss";
import {RightOutlined} from "@ant-design/icons";
import {serverDesc, serverImage, serverTitle} from "./ServerCommon";
import {
    serverGitee,
    serverGithub,
    serverGitlab,
    serverGitpuk,
    serverHadess,
    serverNexus,
    serverPostIn,
    serverPriGitlab,
    serverSonar,
    serverSourceFare,
    serverGitea,
} from "../../../../common/utils/Constant";
import serverStore from "../store/ServerStore";

const serverList = [
    {
        title: '代码源',
        list: [
            serverGitpuk,
            serverGitee,
            serverGithub,
            serverGitlab,
            serverPriGitlab,
            serverGitea,
        ]
    },
    {
        title: '代码扫描',
        list: [
            serverSourceFare,
            serverSonar,
        ]
    },
    {
        title: '制品管理',
        list: [
            serverHadess,
            serverNexus,
        ]
    },
    {
        title: '自动化测试',
        list: [
            serverPostIn,
        ]
    },
]

const Server = props =>{

    const {findAuthServerByTypeGroup} = serverStore;

    const [serverGroup,setServerGroup] = useState([]);

    useEffect(() => {
        findAuthServerByTypeGroup().then(res=>{
            if(res.code===0){
                setServerGroup(res?.data || [])
            }
        })
    }, []);

    const GroupHtml = (key) => {
        const item = serverGroup?.find(item=>item.type===key);
        return `共${item?.number || '0'}条`
    }

    return (
        <Row className="server">
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
                            {title:'服务集成'}
                        ]}
                    >
                    </BreadCrumb>
                    <div className='server-content'>
                        {
                            serverList.map(({title,list})=>(
                                <div key={title} className='server-list'>
                                    <div className='server-ul-title'>
                                        {title}
                                    </div>
                                    <div className="server-ul">
                                        {
                                            list.map(key=> (
                                                <div key={key} className="server-li" onClick={()=>props.history.push(`/setting/server/${key}`)}>
                                                    <div className="server-li-icon">
                                                        <img src={serverImage[key]} alt={''} width={18} height={18}/>
                                                    </div>
                                                    <div className="server-li-center">
                                                        <div className="server-li-title">
                                                            {serverTitle[key]}
                                                        </div>
                                                        <div className="server-li-desc">
                                                            {GroupHtml(key)}
                                                        </div>
                                                    </div>
                                                    <div className="server-li-down">
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

export default Server
