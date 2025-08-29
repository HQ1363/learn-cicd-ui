/**
 * @Description: 流水线
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React,{useEffect,useState} from "react";
import {Select, Space, Row, Col, Spin, Dropdown, Form} from "antd";
import {getUser} from "tiklab-core-ui";
import PipelineTable from "./PipelineTable";
import BreadCrumb from "../../../common/component/breadcrumb/BreadCrumb";
import Button from "../../../common/component/button/Button";
import Tabs from "../../../common/component/tabs/Tabs";
import SearchInput from "../../../common/component/search/SearchInput";
import SearchSelect from "../../../common/component/search/SearchSelect";
import {debounce} from "../../../common/utils/Client";
import pipelineStore from "../store/PipelineStore";
import envStore from "../../../setting/configure/env/store/EnvStore";
import groupingStore from "../../../setting/configure/grouping/store/GroupingStore";
import PipelineAdd from "./PipelineAdd";
import "./Pipeline.scss";
import pipScreen from "../../../assets/images/svg/pip_screen.svg";
import ListIcon from "../../../common/component/list/ListIcon";
import ListEmpty from "../../../common/component/list/ListEmpty";
import homePageStore from "../../../home/store/HomePageStore";
import {PrivilegeButton} from "tiklab-privilege-ui";

const pageSize = 10;

const Pipeline = props =>{

    const {findUserPipelinePage,findPipelineCount,findUserPage} = pipelineStore;
    const {findEnvList} = envStore;
    const {findGroupList} = groupingStore;
    const {findOpenPage} = homePageStore;

    const user = getUser();

    const pageParam = {
        pageSize:pageSize,
        currentPage: 1,
    }

    //流水线分类
    const [listType,setListType] = useState('all')
    //刷新状态
    const [fresh,setFresh] = useState(false)
    //加载状态
    const [isLoading,setIsLoading] = useState(false);
    //请求数据
    const [pipelineParam,setPipelineParam] = useState({
        pageParam
    });
    //流水线数据
    const [pipelineData,setPipelineData] = useState({});
    //环境管理列表
    const [envList,setEnvList] = useState([]);
    //应用管理列表
    const [groupList,setGroupList] = useState([]);
    //添加弹出框
    const [visible,setVisible] = useState(false);
    //流水线统计
    const [pipCount,setPipCount] = useState({});
    //高级筛选下拉框
    const [screenVisible,setScreenVisible] = useState(false);
    //常用流水线
    const [newlyOpen,setNewlyOpen] = useState([]);
    //常用流水线加载
    const [openSpinning,setOpenSpinning] = useState(true);

    useEffect(()=>{
        // 获取环境和应用管理
        getEnvOrGroup()
        // 获取常用流水线
        findOpenPage({
            pageParam:{pageSize:4,currentPage:1},
        }).then(res=>{
            if(res.code===0){
                setNewlyOpen(res?.data?.dataList || [])
            }
        }).finally(()=>{
            setOpenSpinning(false)
        })
    },[])

    /**
     * 获取环境和应用管理
     */
    const getEnvOrGroup = () => {
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
     * 获取流水线统计
     */
    const findPipCount = () => {
        findPipelineCount(pipelineParam).then(res=>{
            if(res.code===0){
                setPipCount(res.data)
            }
        })
    }

    useEffect(()=>{
        // 流水线
        findPipeline()
        // 获取流水线统计
        findPipCount()
    },[pipelineParam,fresh])

    /**
     * 获取流水线
     */
    const findPipeline = () =>{
        setIsLoading(true)
        let param = {
            ...pipelineParam,
            orderParams: [{name: "createTime", orderType: "desc"}],
        };
        if(listType==='create'){
            param.createUserId = pipelineParam?.createUserId || user.userId;
        }
        if(listType==='follow'){
            param.pipelineFollow = 1;
        }
        findUserPipelinePage(param).then(res=>{
            if(res.code===0){
                setPipelineData(res.data)
            }
        }).finally(()=>setIsLoading(false))
    }

    /**
     * 模糊查询流水线
     * @param e：文本框value
     */
    const onChangeSearch = debounce((e) => {
        setPipelineParam({
            ...pipelineParam,
            pipelineName:e.target.value,
            pageParam
        })
    }, 500);

    /**
     * 换页
     * @param page
     */
    const changPage = page =>{
        setPipelineParam({
            ...pipelineParam,
            pageParam:{
                pageSize:pageSize,
                currentPage: page,
            }
        })
    }

    /**
     * 切换流水线类型
     * @param item
     */
    const clickType = item => {
        setPipelineParam({
            ...pipelineParam,
            pageParam
        })
        setListType(item.id)
    }

    /**
     * 操作更新流水线状态
     */
    const changFresh = () => {
        setFresh(!fresh)
    }

    /**
     * 去添加流水线页面
     */
    const onClick = () =>{
        setVisible(true)
    }

    const [form] = Form.useForm();

    //流水线成员
    const [userList,setUserList] = useState([]);
    //当前页
    const [currentPage,setCurrentPage] = useState(1)
    //分页
    const [userPage,setUserPage] = useState({})

    useEffect(() => {
        findUser()
    }, [currentPage]);

    /**
     * 获取流水线成员
     */
    const findUser = () => {
        findUserPage({
            pageParam:{pageSize:9,currentPage}
        }).then(res=>{
            if(res.code===0){
                setUserPage(res.data);
                if(currentPage===1){
                    setUserList(res.data.dataList)
                } else {
                    setUserList([...userList,...res.data.dataList])
                }
            }
        })
    }

    /**
     * 下拉滚动加载用户
     * @param e
     */
    const scrollEnd = (e) => {
        e.persist();
        const { target } = e;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            if (currentPage < userPage.totalPage) {
                setCurrentPage(currentPage+1)
            }
        }
    }

    /**
     * 字段更新
     */
    const onValuesChange = (changedValues) => {
        const updatedParams = { ...pipelineParam,...changedValues,pageParam };
        Object.keys(changedValues).forEach((key) => {
            if (changedValues[key] === "all") {
                delete updatedParams[key];
            }
        });
        setPipelineParam(updatedParams)
    }

    /**
     * 重置
     */
    const onReset = () =>{
        form.resetFields();
        setPipelineParam(prev => ({
            pageParam,
            pipelineName: prev.pipelineName,
        }));
    }

    return (
        <Row className="pipeline">
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "20", offset: "2" }}
                xxl={{ span: "18", offset: "3" }}
            >
                <div className="arbess-home-limited">
                    <BreadCrumb
                        crumbs={[
                            {title:'流水线'}
                        ]}
                    >
                        <PrivilegeButton code={'pipeline_create'}>
                            <Button onClick={onClick} type={"primary"} title={"新建流水线"}/>
                        </PrivilegeButton>
                    </BreadCrumb>
                    <PipelineAdd
                        {...props}
                        visible={visible}
                        setVisible={setVisible}
                    />
                    <div className="home-recent">
                        <div className="home-recent-title">
                            常用
                        </div>
                        <Spin spinning={openSpinning}>
                            {
                                newlyOpen && newlyOpen.length > 0 ?
                                    <div className="pipelineRecent-content">
                                        {
                                            newlyOpen.map(item=> {
                                                const {pipeline,execStatus} = item
                                                return (
                                                    <div className="pipelineRecent-item" key={pipeline?.id}
                                                         onClick={()=> props.history.push(`/pipeline/${pipeline?.id}/config`)}
                                                    >
                                                        {
                                                            pipeline &&
                                                            <div className="pipelineRecent-item-title">
                                                                <ListIcon
                                                                    text={pipeline?.name || "T"}
                                                                    colors={pipeline?.color}
                                                                />
                                                                <div className="pipelineRecent-name">
                                                                    {pipeline?.name}
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className="pipelineRecent-item-details">
                                                            <div className="pipelineRecent-item-detail">
                                                                <span className="details-desc">成功</span>
                                                                <span>{execStatus?.successNumber || 0}</span>
                                                            </div>
                                                            <div className="pipelineRecent-item-detail">
                                                                <span className="details-desc">失败</span>
                                                                <span>{execStatus?.errorNumber || 0}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    :
                                    <ListEmpty />
                            }
                        </Spin>
                    </div>
                    <div className="pipeline-flex">
                        <Tabs
                            type={listType}
                            tabLis={[
                                {id:'all', title:<>所有<span className="count-number">{pipCount?.pipelineNumber || 0}</span></>},
                                {id:'create', title:<>我创建的<span className="count-number">{pipCount?.userPipelineNumber || 0}</span></>},
                                {id:'follow', title:<>我收藏的<span className="count-number">{pipCount?.userFollowNumber || 0}</span></>},
                            ]}
                            onClick={clickType}
                        />
                        <Space>
                            <SearchSelect
                                showSearch
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                style={{width:150}}
                                placeholder={"应用"}
                                onChange={value=>onValuesChange({
                                    groupId: value
                                })}
                            >
                                <Select.Option value={'all'} key={'all'}>全部</Select.Option>
                                {
                                    groupList && groupList.map(item=>(
                                        <Select.Option value={item.id} key={item.id}>{item.groupName}</Select.Option>
                                    ))
                                }
                            </SearchSelect>
                            <SearchSelect
                                showSearch
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                style={{width:150}}
                                placeholder={"环境"}
                                onChange={value=>onValuesChange({
                                    envId: value
                                })}
                            >
                                <Select.Option value={'all'} key={'all'}>全部</Select.Option>
                                {
                                    envList && envList.map(item=>(
                                        <Select.Option value={item.id} key={item.id}>{item.envName}</Select.Option>
                                    ))
                                }
                            </SearchSelect>
                            <SearchInput
                                placeholder="搜索名称"
                                onPressEnter={onChangeSearch}
                                style={{ width: 180 }}
                            />
                            <Dropdown
                                overlay={
                                    <div className='pipeline-senior-screen-drop'>
                                        <Form
                                            form={form}
                                            layout={'vertical'}
                                            onValuesChange={onValuesChange}
                                        >
                                            <Form.Item label={'创建人'} name={'createUserId'}>
                                                <Select
                                                    placeholder={"创建人"}
                                                    onPopupScroll={scrollEnd}
                                                    bordered={false}
                                                    getPopupContainer={e=>e.parentElement}
                                                >
                                                    <Select.Option value={'all'} key={'all'}>全部</Select.Option>
                                                    {
                                                        userList && userList.map(item=>(
                                                            <Select.Option key={item.id} value={item.id}>{item.nickname}</Select.Option>
                                                        ))
                                                    }
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label={'权限'} name={'pipelinePower'}>
                                                <Select placeholder={"权限"} bordered={false} getPopupContainer={e=>e.parentElement}>
                                                    <Select.Option value={'all'} key={'all'}>全部</Select.Option>
                                                    <Select.Option value={1} key={1}>全局</Select.Option>
                                                    <Select.Option value={2} key={2}>私有</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Form>
                                        <div className='screen-drop-button'>
                                            <Button isMar={true} onClick={()=>setScreenVisible(false)}>
                                                取消
                                            </Button>
                                            <Button isMar={true} onClick={onReset}>
                                                重置
                                            </Button>
                                            <Button type={'primary'} onClick={()=>setScreenVisible(false)}>
                                                确定
                                            </Button>
                                        </div>
                                    </div>
                                }
                                trigger={['click']}
                                visible={screenVisible}
                                onVisibleChange={visible=>setScreenVisible(visible)}
                                getPopupContainer={e=>e.parentElement}
                                placement={'bottomRight'}
                            >
                                <div className='pipeline-senior-screen'>
                                    <img src={pipScreen} width={22} height={22}/>
                                </div>
                            </Dropdown>
                        </Space>
                    </div>
                    <Spin spinning={isLoading}>
                        <PipelineTable
                            {...props}
                            listType={listType}
                            setIsLoading={setIsLoading}
                            changPage={changPage}
                            changFresh={changFresh}
                            pipelineData={pipelineData}
                        />
                    </Spin>
                </div>
            </Col>
        </Row>
    )
}

export default Pipeline
