/**
 * @Description: 流水线环境管理
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React,{useEffect,useState} from "react";
import {Space, Table, Row, Col, Spin} from "antd";
import BreadCrumb from "../../../../common/component/breadcrumb/BreadCrumb";
import ListEmpty from "../../../../common/component/list/ListEmpty";
import ListIcon from "../../../../common/component/list/ListIcon";
import ListAction from "../../../../common/component/list/ListAction";
import Profile from "../../../../common/component/profile/Profile";
import Button from "../../../../common/component/button/Button";
import EnvModal from "./EnvModal";
import envStore from "../store/EnvStore";
import "./Env.scss";
import {PrivilegeButton} from "tiklab-privilege-ui";

const Env = props =>{

    const {findEnvList,deleteEnv} = envStore

    //环境管理列表
    const [envList,setEnvList] = useState([])
    //弹出框状态
    const [visible,setVisible] = useState(false)
    //弹出框form表单value
    const [formValue,setFormValue] = useState(null)
    //加载
    const [spinning,setSpinning] = useState(false)

    useEffect(()=>{
        // 初始化认证配置
        findEnv()
    },[])

    /**
     * 获取环境管理
     */
    const findEnv = () =>{
        setSpinning(true)
        findEnvList().then(res=>{
            if(res.code===0){
                setEnvList(res.data || [])
            }
        }).finally(()=>{
            setSpinning(false)
        })
    }

    const createEnv = () => {
        setVisible(true)
        setFormValue(null)
    }

    /**
     * 编辑环境管理
     * @param record
     */
    const editAuth = record => {
        setVisible(true)
        setFormValue(record)
    }

    /**
     * 删除环境管理
     * @param record
     */
    const delAuth = record => {
        deleteEnv(record.id).then(r=>{
            if(r.code===0){
                findEnv()
            }
        })
    }

    const columns = [
        {
            title:"名称",
            dataIndex:"envName",
            key:"envName",
            width:"35%",
            ellipsis:true,
            render:text => {
                return (
                    <span>
                        <ListIcon text={text}/>
                        <span>{text}</span>
                    </span>
                )
            }
        },
        {
            title:"创建人",
            dataIndex:["user","nickname"],
            key:"user",
            width:"28%",
            ellipsis:true,
            render:(text,record) => {
                return (
                    <Space>
                        <Profile userInfo={record.user}/>
                        {text}
                    </Space>
                )
            }
        },
        {
            title:"创建时间",
            dataIndex:"createTime",
            key:"createTime",
            width:"27%",
            ellipsis:true,
            render:text => text || "--"
        },
        {
            title:"操作",
            dataIndex: "action",
            key: "action",
            width:"10%",
            ellipsis:true,
            render:(_,record) => (
                record.id!=='default' &&
                <ListAction
                    edit={()=>editAuth(record)}
                    del={()=>delAuth(record)}
                    isMore={true}
                    code={{
                        editCode: 'pipeline_environment_update',
                        delCode: 'pipeline_environment_delete',
                    }}
                />
            )
        }
    ]

    return(
        <Row className="env">
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "18", offset: "3" }}
                xxl={{ span: "16", offset: "4" }}
            >
                <div className='arbess-home-limited'>
                    <BreadCrumb
                        crumbs={[
                            {title:'环境'}
                        ]}
                    >
                        <PrivilegeButton code={'pipeline_environment_add'}>
                            <Button
                                type={'primary'}
                                title={"添加环境"}
                                onClick={createEnv}
                            />
                        </PrivilegeButton>
                    </BreadCrumb>
                    <EnvModal
                        visible={visible}
                        setVisible={setVisible}
                        formValue={formValue}
                        findEnv={findEnv}
                    />
                    <div className="env-content">
                        <Spin spinning={spinning}>
                            <Table
                                columns={columns}
                                dataSource={envList}
                                rowKey={record=>record.id}
                                pagination={false}
                                locale={{emptyText: <ListEmpty />}}
                            />
                        </Spin>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default Env
