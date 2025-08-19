/**
 * @Description: 流水线添加编辑信息
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React, {useEffect,useState,forwardRef,useImperativeHandle} from "react";
import {Form, Select, Space, Table, Tooltip,Dropdown , Input} from "antd";
import {DeleteOutlined, LockOutlined, UnlockOutlined} from "@ant-design/icons";
import {observer} from "mobx-react";
import {getUser} from "tiklab-core-ui";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import Profile from "../../../common/component/profile/Profile";
import Button from "../../../common/component/button/Button";
import ListEmpty from "../../../common/component/list/ListEmpty";
import PipelineUserAdd from "./PipelineUserAdd";
import envStore from "../../../setting/configure/env/store/EnvStore";
import groupingStore from "../../../setting/configure/grouping/store/GroupingStore";
import pipelineStore from "../store/PipelineStore";
import "./PipelineAddInfo.scss";

const PipelineAddInfo = forwardRef((props, ref) =>{

    const {
        set,setCurrent,baseInfo,setBaseInfo,onClick,pipeline,setPipeline,changFresh,
    } = props

    const {findUserPipeline,updatePipeline,pipelineList} = pipelineStore;
    const {findEnvList} = envStore;
    const {findGroupList} = groupingStore;

    const [form] = Form.useForm()
    const user = getUser()

    //添加用户下拉显示
    const [visible,setVisible] = useState(false);
    //流水线类型 -- 1多任务或2或阶段
    const [type,setType] = useState(baseInfo?.type || 1);
    //流水线权限 -- 1私有或2公有
    const [powerType,setPowerType] = useState(1);
    //流水线私有添加用户
    const [yUserList,setYUserList] = useState(baseInfo?.userList || []);
    //环境管理列表
    const [envList,setEnvList] = useState([]);
    //应用管理列表
    const [groupList,setGroupList] = useState([]);

    useEffect(()=>{
        // 获取环境和应用管理
        findEnvAndGroup();
        // 获取所有流水线
        findUserPipeline().then();
        if(!set){
            // 初始化权限
            setPowerType(baseInfo?.power || 1)
        }
    },[]);

    useEffect(() => {
        if(pipeline){
            form.setFieldsValue(pipeline);
            setPowerType(pipeline?.power)
        }
    }, [pipeline]);

    /**
     * 获取环境和应用管理
     */
    const findEnvAndGroup = () => {
        findEnvList().then(res=>{
            if(res.code===0){
                setEnvList(res.data || [])
            }
        })
        findGroupList().then(res=>{
            if(res.code===0){
                setGroupList(res.data || [])
            }
        })
    }

    /**
     * 改变用户权限
     * @param record
     * @param value
     */
    const changePower = (record,value) => {
        yUserList && yUserList.map(item=>{
            if(item.id===record.id){
                item.roleType = value
            }
        })
        setYUserList([...yUserList])
    }

    /**
     * 移出用户
     * @param record
     */
    const del = record =>{
        // yUserList（已选择） 减少
        setYUserList(yUserList.filter(item=>item.id!==record.id))
    }

    /**
     * 流水线创建或更新确定
     */
    const onOk = () => {
        form.validateFields().then(value=>{
            if(set){
                const params={
                    ...value,
                    id: pipeline.id,
                    name: value.name=== "" ? pipeline.name : value.name,
                    power: powerType,
                }
                updatePipeline(params).then(res => {
                    if (res.code === 0) {
                        if(typeof changFresh === 'function'){
                            onClick();
                            changFresh();
                        } else {
                            setPipeline({
                                ...pipeline,
                                ...params,
                            })
                        }
                        findUserPipeline().then()
                    }
                })
                return
            }
            setCurrent(1)
            setBaseInfo({
                ...value,
                type: 2,
                power: powerType,
                userList: yUserList,
            })
        })
    }

    /**
     * 重置表单
     */
    const onRest = () =>{
        form.resetFields();
    }

    useImperativeHandle(ref, () => ({
        onOk,
        onRest,
    }));

    const powerLis = [
        {
            id:1,
            title:"全局",
            icon:<UnlockOutlined />,
            desc:"公共项目，全部成员可见。不支持TFVC等某些功能。"
        },
        {
            id:2,
            title:"私有",
            icon:<LockOutlined />,
            desc: "只有您授予访问权限的人才能查看此项目。"
        }
    ]

    // 权限
    const renderPowerType = (
        <Form.Item className="pipeline-power" label='流水线权限'>
            <div className="pipeline-power-content">
                {
                    powerLis.map(item=>{
                        return <div
                            key={item.id}
                            className={`pipeline-power-item ${set ? "pipeline-power-set":"pipeline-power-noSet"} ${powerType===item.id?"pipeline-power-select":""}`}
                            onClick={()=>setPowerType(item.id)}
                        >
                            <div className="power-item">
                                <div>
                                    <div className="power-title power-icon">{item.icon}</div>
                                    <div className="power-title power-name">{item.title}</div>
                                </div>
                            </div>
                            <div className="power-desc">{item.desc}</div>
                        </div>
                    })
                }
            </div>
        </Form.Item>
    )

    const columns = [
        {
            title:"姓名",
            dataIndex:"nickname",
            key:"nickname",
            width:"35%",
            ellipsis:true,
            render: text => text || '--'
        },
        {
            title:"名称",
            dataIndex:"name",
            key:"name",
            width:"30%",
            ellipsis:true,
            render:(text,record)=>{
                return (
                    <Space>
                        <Profile userInfo={record}/>
                        {text || '--'}
                    </Space>
                )
            }
        },
        {
            title:"权限",
            dataIndex:"roleType",
            key:"roleType",
            width:"28",
            ellipsis:true,
            render: (_,record)=>(
                <Select
                    bordered={false}
                    style={{width:120}}
                    defaultValue={record.roleType}
                    disabled={record.id===user.userId}
                    onChange={value=>changePower(record,value)}
                >
                    {
                        record.id===user.userId &&
                        <Select.Option value={2}>超级管理员</Select.Option>
                    }
                    <Select.Option value={1}>管理员角色</Select.Option>
                    <Select.Option value={0}>默认角色</Select.Option>
                </Select>
            )
        },
        {
            title:"操作",
            dataIndex:"action",
            key:"action",
            width:"7%",
            ellipsis:true,
            render: (_,record) => {
                if (record.id !== user.userId) {
                    return (
                        <Tooltip title="移出用户">
                            <DeleteOutlined onClick={()=>del(record)}/>
                        </Tooltip>
                    )
                }
                return (
                    <span className="user-table-ban">
                         <DeleteOutlined />
                    </span>
                )
            }
        },
    ]

    // 表单名称效验
    const rules = [
        {
            required:!set,
            message:"名称不能为空"
        },
        {
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]{0,50}$/,
            message: "流水线名称最长50位且不能包含非法字符，如&，%，&，#，……等",
        },
        ({ getFieldValue }) => ({
            validator(rule,value) {
                let nameArray = []
                if(set){
                    nameArray = pipelineList && pipelineList.map(item=>item.name).filter(li=>li!==pipeline.name)
                }else {
                    nameArray = pipelineList && pipelineList.map(item=>item.name)
                }
                if (nameArray.includes(value)) {
                    return Promise.reject("名称已经存在");
                }
                return Promise.resolve()
            },
        }),
    ]

    //流水线名称长度
    const [nameLength,setNameLength] = useState(0);

    useEffect(() => {
        if(set) {
            setNameLength(pipeline?.name?.length || 0)
        }
    }, [pipeline]);

    if(set){
        return (
            <>
                <Form
                    form={form}
                    autoComplete="off"
                    layout={"vertical"}
                    initialValues={pipeline}
                >
                    <Form.Item label={"流水线名称"} name="name" rules={rules}>
                        <Input
                            allowClear
                            placeholder={'流水线名称'}
                            maxLength={50}
                            suffix={<span style={{ color: '#999' }}>{nameLength}/50</span>}
                            onChange={(e) => setNameLength(e.target.value.length)}
                        />
                    </Form.Item>
                    <Form.Item label={"流水线应用"} name={['group','id']}>
                        <Select placeholder={'流水线应用'} getPopupContainer={e => e.parentElement}>
                            {
                                groupList && groupList.map(item=>(
                                    <Select.Option value={item.id} key={item.id}>{item.groupName}</Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label={"流水线环境"} name={['env','id']}>
                        <Select placeholder={'流水线环境'} getPopupContainer={e => e.parentElement}>
                            {
                                envList && envList.map(item=>(
                                    <Select.Option value={item.id} key={item.id}>{item.envName}</Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    { renderPowerType }
                </Form>
                {
                    typeof changFresh === 'function' ? null :
                        <>
                            <Button onClick={onClick} title={"取消"} isMar={true}/>
                            <PrivilegeProjectButton code={"pipeline_update"} domainId={pipeline && pipeline.id}>
                                <Button type={"primary"} title={"确定"} onClick={onOk}/>
                            </PrivilegeProjectButton>
                        </>
                }
            </>
        )
    }

    return (
        <Form
            form={form}
            autoComplete="off"
            layout={"vertical"}
            initialValues={baseInfo}
        >
            <Form.Item
                label={"流水线名称"}
                name="name"
                rules={rules}
            >
                <Input
                    allowClear
                    placeholder={'流水线名称'}
                    maxLength={50}
                    suffix={<span style={{ color: '#999' }}>{nameLength}/50</span>}
                    onChange={(e) => setNameLength(e.target.value.length)}
                />
            </Form.Item>
            <Form.Item label={"流水线应用"} name={['group','id']}>
                <Select placeholder={'流水线应用'} >
                    {
                        groupList && groupList.map(item=>(
                            <Select.Option value={item.id} key={item.id}>{item.groupName}</Select.Option>
                        ))
                    }
                </Select>
            </Form.Item>
            <Form.Item label={"流水线环境"} name={['env','id']}>
                <Select placeholder={'流水线环境'} >
                    {
                        envList && envList.map(item=>(
                            <Select.Option value={item.id} key={item.id}>{item.envName}</Select.Option>
                        ))
                    }
                </Select>
            </Form.Item>
            { renderPowerType }
            {
                powerType === 2 &&
                <div className="pipeline-user">
                    <div className="pipeline-user-title ant-form-item-label">
                        <label>通知对象</label>
                        <Dropdown
                            getPopupContainer={e => e.parentElement}
                            overlay={
                                <PipelineUserAdd
                                    setVisible={setVisible}
                                    yUserList={yUserList}
                                    setYUserList={setYUserList}
                                    pipelineStore={pipelineStore}
                                />
                            }
                            visible={visible}
                            onVisibleChange={visible=>setVisible(visible)}
                            trigger={['click']}
                            placement={'bottomRight'}
                            overlayStyle={{width:240}}
                        >
                            <Button
                                type={"link-nopadding"}
                                title={"添加成员"}
                            />
                        </Dropdown>
                    </div>
                    <div className="pipeline-user-table">
                        <Table
                            rowKey={(record) => record.id}
                            columns={columns}
                            dataSource={yUserList}
                            pagination={false}
                            showHeader={false}
                            locale={{emptyText: <ListEmpty/>}}
                        />
                    </div>
                </div>
            }
        </Form>
    )
})

export default observer(PipelineAddInfo)
