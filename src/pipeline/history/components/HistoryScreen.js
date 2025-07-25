/**
 * @Description: 流水线历史筛选
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React,{useEffect,useState} from "react";
import {Dropdown, Form, Select, Space} from "antd";
import {observer} from "mobx-react";
import SearchInput from "../../../common/component/search/SearchInput";
import Tabs from "../../../common/component/tabs/Tabs";
import pipelineStore from "../../pipeline/store/PipelineStore";
import Button from "../../../common/component/button/Button";
import pipScreen from "../../../assets/images/svg/pip_screen.svg";
import {debounce} from "../../../common/utils/Client";
import {getUser} from "tiklab-core-ui";

const HistoryScreen = props =>{

    const {match,pageParam,requestParam,setRequestParam,route,historyCount,activeTab,setActiveTab} = props

    const {findUserPipelinePage,findUserPage,findDmUserPage} = pipelineStore

    const user = getUser();
    //流水线
    const [pipelineList,setPipelineList] = useState([]);
    //流水线当前页
    const [currentPage,setCurrentPage] = useState(1);
    //流水线分页
    const [page,setPage] = useState({});
    //成员
    const [userList,setUserList] = useState([]);
    //成员当前页
    const [userCurrentPage,setUserCurrentPage] = useState(1);
    //成员分页
    const [userPage,setUserPage] = useState({});
    //高级筛选下拉框
    const [screenVisible,setScreenVisible] = useState(false);

    useEffect(()=>{
        if(route.path==='/history'){
            //流水线
            findPipeline()
        }
    },[currentPage])

    useEffect(()=>{
        //用户
        if(route.path==='/history'){
            findUser();
        }
        if(route.path==='/pipeline/:id/history'){
            findDmUser()
        }
    },[userCurrentPage])

    /**
     * 获取流水线
     */
    const findPipeline = () => {
        findUserPipelinePage({
            pageParam:{
                pageSize: 10,
                currentPage: currentPage,
            },
        }).then(res=>{
            if(res.code===0){
                setPage({
                    totalRecord: res.data.totalRecord,
                    totalPage: res.data.totalPage,
                })
                if(currentPage===1){
                    setPipelineList(res.data.dataList)
                } else {
                    setPipelineList([...pipelineList,...res.data.dataList])
                }
            }
        })
    }

    /**
     * 获取用户
     */
    const findUser = () =>{
        findUserPage({
            pageParam:{
                pageSize: 10,
                currentPage: userCurrentPage,
            },
        }).then(res=>{
            if(res.code===0){
                setUserPage({
                    totalRecord: res.data.totalRecord,
                    totalPage: res.data.totalPage,
                })
                if(userCurrentPage===1){
                    setUserList(res.data.dataList)
                } else {
                    setUserList([...userList,...res.data.dataList])
                }
            }
        })
    }

    /**
     * 获取流水线成员
     */
    const findDmUser = () =>{
        findDmUserPage({
            pageParam:{
                pageSize: 10,
                currentPage: userCurrentPage,
            },
            domainId:match.params.id
        }).then(res=>{
            if(res.code===0){
                setUserPage({
                    totalRecord: res.data.totalRecord,
                    totalPage: res.data.totalPage,
                })
                if(userCurrentPage===1){
                    setUserList(res.data.dataList)
                } else {
                    setUserList([...userList,...res.data.dataList])
                }
            }
        })
    }

    /**
     * 下拉滚动加载流水线
     * @param e
     */
    const scrollEnd = (e) => {
        e.persist();
        const { target } = e;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            if (currentPage < page.totalPage) {
                setCurrentPage(currentPage+1)
            }
        }
    }

    /**
     * 下拉滚动加载用户
     * @param e
     */
    const scrollUserEnd = (e) => {
        e.persist();
        const { target } = e;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            if (userCurrentPage < userPage.totalPage) {
                setUserCurrentPage(userCurrentPage+1)
            }
        }
    }


    /**
     * activeTab更改
     */
    const changActiveTab = item =>{
        setActiveTab(item.id);
        setRequestParam(prev => ({
            ...prev,
            pageParam
        }));
    }

    /**
     * 模糊搜索
     */
    const onSearch = debounce((e) => {
        setRequestParam(prev => ({
            ...prev,
            number: e.target.value,
            pageParam,
        }));
    }, 500);

    const [form] = Form.useForm();

    /**
     * 字段更新
     */
    const onValuesChange = (changedValues) => {
        const updatedParams = {...requestParam,...changedValues, pageParam };
        Object.keys(changedValues).forEach((key) => {
            if (changedValues[key] === "all") {
                delete updatedParams[key];
            }
        });
        setRequestParam(updatedParams);
    }


    /**
     * 重置
     */
    const onReset = () =>{
        form.resetFields();
        setRequestParam(prev => ({
            pageParam,
            number: prev.number,
        }));
    }

    return (
        <div className="history-screens">
            <Tabs
                type={activeTab}
                tabLis={[
                    {id:'all', title:<>所有<span className="count-number">{historyCount?.allNumber || 0}</span></>},
                    {id:'userId', title:<>我运行的<span className="count-number">{historyCount?.execNumber || 0}</span></>},
                    {id:'state', title:<>运行中的<span className="count-number">{historyCount?.runNumber || 0}</span></>},
                ]}
                onClick={changActiveTab}
            />
            <Space>
                <SearchInput
                    placeholder="搜索名称"
                    onPressEnter={onSearch}
                    style={{ width: 180 }}
                />
                <Dropdown
                    overlay={
                        <div className='history-senior-screen-drop'>
                            <Form
                                form={form}
                                layout={'vertical'}
                                onValuesChange={onValuesChange}
                            >
                                {
                                    route.path==='/history' ?
                                    <>
                                        <Form.Item label={'流水线'} name={'pipelineId'}>
                                            <Select
                                                placeholder={"流水线"}
                                                onPopupScroll={scrollEnd}
                                                bordered={false}
                                            >
                                                <Select.Option value={'all'} key={'all'}>全部</Select.Option>
                                                {
                                                    pipelineList && pipelineList.map(item=>(
                                                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                                    ))
                                                }
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label={'执行人'} name={'execUserId'}>
                                            <Select
                                                placeholder={"执行人"}
                                                onPopupScroll={scrollUserEnd}
                                                bordered={false}
                                            >
                                                <Select.Option value={'all'} key={'all'}>全部</Select.Option>
                                                {
                                                    userList && userList.map(item=>(
                                                        <Select.Option key={item.id} value={item.id}>{item.nickname}</Select.Option>
                                                    ))
                                                }
                                            </Select>
                                        </Form.Item>
                                    </>
                                    :
                                    <Form.Item label={'执行人'} name={'execUserId'}>
                                        <Select
                                            placeholder={"执行人"}
                                            onPopupScroll={scrollUserEnd}
                                            bordered={false}
                                        >
                                            <Select.Option value={'all'} key={'all'}>全部</Select.Option>
                                            {
                                                userList && userList.map(item=>(
                                                    <Select.Option key={item.id} value={item.user && item.user.id}>{item.user && item.user.nickname}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                }
                                <Form.Item label={'状态'} name={'state'}>
                                    <Select placeholder={"状态"} bordered={false}>
                                        <Select.Option value={'all'} key={'all'}>全部</Select.Option>
                                        <Select.Option value={"success"}>成功</Select.Option>
                                        <Select.Option value={"error"}>失败</Select.Option>
                                        <Select.Option value={"halt"}>终止</Select.Option>
                                        <Select.Option value={"timeout"}>超时</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label={'执行方式'} name={'type'}>
                                    <Select placeholder={"执行方式"} bordered={false}>
                                        <Select.Option value={'all'} key={'all'}>全部</Select.Option>
                                        <Select.Option value={1}>手动</Select.Option>
                                        <Select.Option value={2}>定时</Select.Option>
                                        <Select.Option value={3}>回滚</Select.Option>
                                        <Select.Option value={4}>WebHook</Select.Option>
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
                >
                    <div className='history-senior-screen'>
                        <img src={pipScreen} width={22} height={22}/>
                    </div>
                </Dropdown>
            </Space>
        </div>
    )
}

export default observer(HistoryScreen)
