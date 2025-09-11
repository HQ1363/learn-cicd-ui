/**
 * @Description: 服务集成
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React,{useState,useEffect} from "react";
import {Space, Table, Row, Col, Spin, Empty} from "antd";
import serverStore from "../store/ServerStore";
import BreadCrumb from "../../../../common/component/breadcrumb/BreadCrumb";
import ListEmpty from "../../../../common/component/list/ListEmpty";
import ListIcon from "../../../../common/component/list/ListIcon";
import ListAction from "../../../../common/component/list/ListAction";
import Profile from "../../../../common/component/profile/Profile";
import ServerDetailAddBtn from "./ServerDetailAddBtn";
import "./Server.scss";
import SearchInput from "../../../../common/component/search/SearchInput";
import Page from "../../../../common/component/page/Page";
import {serverTitle,serverList} from "./ServerCommon";
import {
    serverGitee,
    serverGithub,
    serverGitlab,
    serverPriGitlab,
    serverGitpuk,
    serverPostIn,
    serverSonar,
    serverNexus,
    serverHadess,
    serverSourceFare, serverGitea,
} from "../../../../common/utils/Constant";
import {maskString} from "../../../../common/utils/Client";
import {PrivilegeButton} from "tiklab-privilege-ui";

const pageSize = 13;

const ServerDetail = props =>{

    const {match} = props;

    const serverType = match.params.type;

    const {findAuthServerPage,deleteAuthServer} = serverStore

    //弹出框状态
    const [visible,setVisible] = useState(false);
    //弹出窗form表单value
    const [formValue,setFormValue] = useState(null);
    //服务配置列表
    const [authServer,setAuthServer] = useState({});
    const pageParam = {
        pageSize:pageSize,
        currentPage: 1,
    };
    //请求数据
    const [requestParams,setRequestParams] = useState({
        pageParam
    });
    //加载
    const [spinning,setSpinning] = useState(false);

    useEffect(()=>{
        // 初始化服务配置
        findAuth()
    },[requestParams])

    /**
     * 获取服务配置
     */
    const findAuth = () =>{
        setSpinning(true)
        findAuthServerPage({
            ...requestParams,
            type: serverType,
        }).then(r=>{
            if(r.code===0){
                setAuthServer(r.data)
            }
        }).finally(()=>{
            setSpinning(false)
        })
    }

    /**
     * 模糊搜索
     */
    const onSearch = e => {
        setRequestParams({
            ...requestParams,
            pageParam,
            name:e.target.value,
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
     * 编辑服务配置
     * @param record
     */
    const editServer = record => {
        setFormValue(record)
        setVisible(true)
    }

    /**
     * 删除服务配置
     * @param record
     */
    const delServer = record =>{
        deleteAuthServer(record.serverId).then(r=>{
            if(r.code===0){
                findAuth()
            }
        })
    }

    // 标题
    const nameHtml = text => (
        <span>
            <ListIcon text={text}/>
            <span>{text}</span>
        </span>
    )

    // 创建人
    const userHtml = (text,record) => (
        <Space>
            <Profile userInfo={record.user}/>
            {text || '--'}
        </Space>
    )

    const restrictedType = [
        serverGitpuk,
        serverHadess,
        serverPostIn,
        serverSourceFare,
    ]

    // 操作
    const actionHtml = record => {
        const { type } = record;
        const isRestricted = restrictedType.includes(type) && version === 'cloud';

        return isRestricted ? (
            <ListAction
                edit={() => editServer(record)}
                code={{
                    editCode: 'pipeline_service_integration_update',
                }}
            />
        ) : (
            <ListAction
                edit={() => editServer(record)}
                del={() => delServer(record)}
                isMore={true}
                code={{
                    editCode: 'pipeline_service_integration_update',
                    delCode: 'pipeline_service_integration_delete',
                }}
            />
        );
    };

    // 全部
    const allColumn = [
        {
            title:"名称",
            dataIndex:"name",
            key:"name",
            width:"20%",
            ellipsis:true,
            render:text => nameHtml(text)
        },
        {
            title: "服务地址",
            dataIndex: "serverAddress",
            key: "serverAddress",
            width:"25%",
            ellipsis:true,
            render:text => text || '--'
        },
        {
            title:"类型",
            dataIndex:"type",
            key:"type",
            width:"12%",
            ellipsis:true,
            render: text => serverTitle[text]
        },
        {
            title:"创建人",
            dataIndex:["user","nickname"],
            key:"user",
            width:"15%",
            ellipsis:true,
            render:(text,record) => userHtml(text,record)
        },
        {
            title:"创建时间",
            dataIndex:"createTime",
            key:"createTime",
            width:"20%",
            ellipsis:true,
        },
        {
            title:"操作",
            dataIndex: "action",
            key: "action",
            width:"8%",
            ellipsis:true,
            render:(text,record) => actionHtml(record)
        }
    ]

    // 第三方授权认证 Gitee gitlab 和 Github
    const authorizeColumn = [
        {
            title:"名称",
            dataIndex:"name",
            key:"name",
            width:"25%",
            ellipsis:true,
            render:text => nameHtml(text)
        },
        {
            title:"授权信息",
            dataIndex:"accessToken",
            key:"accessToken",
            width:"25%",
            ellipsis:true,
            render: text => maskString(text)
        },
        {
            title:"创建人",
            dataIndex:["user","nickname"],
            key:["user","nickname"],
            width:"20%",
            ellipsis:true,
            render:(text,record) => userHtml(text,record)
        },
        {
            title:"创建时间",
            dataIndex:"createTime",
            key:"createTime",
            width:"22%",
            ellipsis:true,
        },
        {
            title:"操作",
            dataIndex: "action",
            key: "action",
            width:"8%",
            ellipsis:true,
            render:(text,record) => actionHtml(record)
        }
    ]

    // 自建Gitlab
    const priGitlabColumn = [
        {
            title:"名称",
            dataIndex:"name",
            key:"name",
            width:"20%",
            ellipsis:true,
            render:text => nameHtml(text)
        },
        {
            title: "服务地址",
            dataIndex: "serverAddress",
            key: "serverAddress",
            width:"19%",
            ellipsis:true,
        },
        {
            title:"授权信息",
            dataIndex:"accessToken",
            key:"accessToken",
            width:"19%",
            ellipsis:true,
            render: text => maskString(text)
        },
        {
            title:"创建人",
            dataIndex:["user","nickname"],
            key:["user","nickname"],
            width:"15%",
            ellipsis:true,
            render:(text,record) => userHtml(text,record)
        },
        {
            title:"创建时间",
            dataIndex:"createTime",
            key:"createTime",
            width:"19%",
            ellipsis:true,
        },
        {
            title:"操作",
            dataIndex: "action",
            key: "action",
            width:"8%",
            ellipsis:true,
            render:(_,record) => actionHtml(record)
        }
    ]

    // sonar & nexus & testhubo & gitpuk
    const authColumn = [
        {
            title:"名称",
            dataIndex:"name",
            key:"name",
            width:"20%",
            ellipsis:true,
            render:text => nameHtml(text)
        },
        {
            title: "服务地址",
            dataIndex: "serverAddress",
            key: "serverAddress",
            width:"20%",
            ellipsis:true,
        },
        {
            title:"认证类型",
            dataIndex:"authType",
            key:"authType",
            width:"15%",
            ellipsis:true,
            render: text => text===1 ? "用户名密码":"私钥"
        },
        {
            title:"创建人",
            dataIndex:["user","nickname"],
            key:["user","nickname"],
            width:"18%",
            ellipsis:true,
            render:(text,record) => userHtml(text,record)
        },
        {
            title:"创建时间",
            dataIndex:"createTime",
            key:"createTime",
            width:"19%",
            ellipsis:true,
        },
        {
            title:"操作",
            dataIndex: "action",
            key: "action",
            width:"8%",
            ellipsis:true,
            render:(_,record) => actionHtml(record)
        }
    ]

    // 表格内容
    const columns = () =>{
        switch (serverType) {
            case serverGitee:
            case serverGithub:
            case serverGitlab:
                return authorizeColumn
            case serverPriGitlab:
            case serverGitea:
                return priGitlabColumn
            case serverGitpuk:
            case serverPostIn:
            case serverSonar :
            case serverNexus :
            case serverHadess :
            case serverSourceFare :
                return authColumn
            default:
                return allColumn
        }
    }

    const isType = serverList.includes(serverType);

    return isType ? (
        <Row className="server">
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "22", offset: "1"}}
                xxl={{ span: "20", offset: "2" }}
            >
                <div className="arbess-home-limited">
                    <BreadCrumb
                        crumbs={[
                            {title:'服务集成',click:()=>props.history.push(`/setting/server`)},
                            {title:serverTitle[serverType]}
                        ]}
                    >
                        {
                            (restrictedType.includes(serverType) && version === 'cloud') ?
                                null
                                :
                                <PrivilegeButton code={'pipeline_service_integration_add'}>
                                    <ServerDetailAddBtn
                                        type={serverType}
                                        visible={visible}
                                        setVisible={setVisible}
                                        formValue={formValue}
                                        setFormValue={setFormValue}
                                        findAuth={findAuth}
                                    />
                                </PrivilegeButton>
                        }
                    </BreadCrumb>
                    <div className="server-search">
                        <SearchInput
                            placeholder="搜索名称"
                            style={{ width: 190 }}
                            onPressEnter={onSearch}
                        />
                    </div>
                    <div className="server-content">
                        <Spin spinning={spinning}>
                            <Table
                                columns={columns()}
                                dataSource={authServer?.dataList || []}
                                rowKey={record=>record.serverId}
                                pagination={false}
                                locale={{emptyText: <ListEmpty />}}
                            />
                            <Page
                                currentPage={requestParams.pageParam.currentPage}
                                changPage={changPage}
                                page={authServer}
                            />
                        </Spin>
                    </div>
                </div>
            </Col>
        </Row>
    ) : (
        <Row className="server arbess-home-limited">
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "20", offset: "2" }}
                xl={{ span: "16", offset: "4" }}
                xxl={{ span: "16", offset: "4" }}
            >
                <BreadCrumb
                    crumbs={[
                        {title:'服务集成',click:()=>props.history.push(`/setting/server`)},
                    ]}
                />
                <div className='server-content'>
                    <ListEmpty description={'暂不支持该服务'}/>
                </div>
            </Col>
        </Row>
    )
}

export default ServerDetail
