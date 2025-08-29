/**
 * @Description: 流水线导航
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React,{useEffect,useState} from "react";
import {inject,observer,Provider} from "mobx-react";
import {getUser} from "tiklab-core-ui";
import pipelineStore from "../pipeline/store/PipelineStore";
import {renderRoutes} from "react-router-config";
import ListEmpty from "../../common/component/list/ListEmpty";
import ChangeRootUser from "../../common/component/user/changeRootUser";
import {Dropdown, Spin} from "antd";
import SearchInput from "../../common/component/search/SearchInput";
import ListIcon from "../../common/component/list/ListIcon";
import {DownOutlined} from "@ant-design/icons";
import Aside from "../../common/component/aside/PipelineAside";

const PipelineAside= (props)=>{

    const store = {
        pipelineStore
    }

    const {match,systemRoleStore,route,pipelineRouters}=props;

    const {findOnePipeline,updateOpen,findRecentlyPipeline,findUserPipelinePage,pipeline} = pipelineStore;
    const {getInitProjectPermissions} = systemRoleStore;

    const pipelineId = match.params.id;
    const userId = getUser().userId;

    //弹出框状态
    const [visible,setVisible] = useState(false);
    //是否折叠
    const [isExpand,setIsExpand] = useState(()=>{
        const expand = localStorage.getItem('menuExpand');
        return expand==='true'
    });
    //主题色
    const [themeType,setThemeType] = useState(() => {
        const theme = localStorage.getItem('theme');
        return theme  ? theme : 'default'; // 默认 false
    });
    //最近打开的流水线
    const [recentlyPipeline,setRecentlyPipeline] = useState([]);
    //最近打开的流水线下拉框
    const [dropdownVisible,setDropdownVisible] = useState(false);
    //是否为搜索状态
    const [isSearch,setIsSearch] = useState(false);
    //模糊搜索加载
    const [spinning,setSpinning] = useState(false);
    //流水线
    const [pipelineData,setPipelineData] = useState({});
    //文本框内容
    const [inputValue,setInputValue] = useState('');

    useEffect(()=>{
        if(pipelineId){
            findPipeline();
        }
    },[pipelineId])

    /**
     * 获取流水线信息
     */
    const findPipeline = () =>{
        findOnePipeline(pipelineId).then(res=>{
            if(res.data){
                const data = res.data;
                if(data?.user?.status===0){
                    setVisible(true);
                    return;
                }
                // 获取流水线权限
                getInitProjectPermissions(userId,pipelineId,data?.power===1)
                // 更新最近打开的流水线
                updateOpen(pipelineId).then()
            }
        })
    }

    useEffect(() => {
        if(pipelineId){
            findRecentlyPipeline({
                pipelineId:pipelineId,
                number:4,
            }).then(res=>{
                if(res.code===0){
                    setRecentlyPipeline(res.data)
                }
            })
        }
    }, [pipelineId,pipeline?.name]);

    /**
     * 切换流水线
     */
    const changePipeline = (item) => {
        if(pipelineId!==item.id){
            setDropdownVisible(false);
            setInputValue('');
            setIsSearch(false);
            props.history.push(`/pipeline/${item.id}/history`);
        }
    }

    /**
     * 模糊搜索流水线
     */
    const onPressEnter = e => {
        if(e.target.value){
            setIsSearch(true);
            setSpinning(true);
            findUserPipelinePage({
                pageParam:{currentPage:1,pageSize:5},
                pipelineName:e.target.value,
            }).then(res=>{
                if(res.code===0){
                    setPipelineData(res.data)
                }
            }).finally(()=>{
                setSpinning(false);
            })
        } else {
            setIsSearch(false)
        }
    }

    return (
        <Provider {...store}>
            <div className='arbess-layout'>
                <Aside
                    {...props}
                    domainId={pipelineId}
                    backUrl={'/pipeline'}
                    initRouters={pipelineRouters}
                    isExpand={isExpand}
                    setIsExpand={setIsExpand}
                    themeType={themeType}
                    ChangeComponent={
                        <Dropdown
                            getPopupContainer={e => e.parentElement}
                            trigger={['click']}
                            visible={dropdownVisible}
                            onVisibleChange={visible =>{
                                setDropdownVisible(visible)
                                if(!visible) {
                                    setInputValue('');
                                    setIsSearch(false);
                                }
                            }}
                            overlay={
                                <div className="pipeline-opt">
                                    <div className="pipeline-opt-title">
                                        切换流水线
                                    </div>
                                    <div className='pipeline-opt-search'>
                                        <SearchInput
                                            onPressEnter={onPressEnter}
                                            placeholder={"搜索流水线"}
                                            value={inputValue}
                                            onChange={e=>{
                                                setInputValue(e.target.value);
                                                if(e.type==='click'){
                                                    onPressEnter(e);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="pipeline-opt-group">
                                        {
                                            isSearch ?
                                                <Spin spinning={spinning}>
                                                    {
                                                        pipelineData?.dataList?.length > 0 ?
                                                            pipelineData?.dataList?.map(item=>{
                                                                if(item){
                                                                    return (
                                                                        <div onClick={()=>changePipeline(item)}
                                                                             key={item.id}
                                                                             className="pipeline-opt-item"
                                                                        >
                                                                            <span className={`pipeline-opt-icon arbess-icon-${item.color}`}>
                                                                                {item.name.substring(0,1).toUpperCase()}
                                                                            </span>
                                                                            <span className="pipeline-opt-name" title={item.name}>
                                                                                {item.name}
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                }
                                                                return null
                                                            })
                                                            :
                                                            <ListEmpty />
                                                    }
                                                </Spin>
                                                :
                                                recentlyPipeline?.map(item=>{
                                                    if(item){
                                                        return (
                                                            <div onClick={()=>changePipeline(item)}
                                                                 key={item.id}
                                                                 className={`pipeline-opt-item ${item.id===pipeline?.id ? "pipeline-opt-active":""}`}
                                                            >
                                                                <span className={`pipeline-opt-icon arbess-icon-${item.color}`}>
                                                                    {item.name.substring(0,1).toUpperCase()}
                                                                </span>
                                                                <span className="pipeline-opt-name" title={item.name}>
                                                                    {item.name}
                                                                </span>
                                                            </div>
                                                        )
                                                    }
                                                    return null
                                                })
                                        }
                                        <div className='pipeline-opt-more'
                                             onClick={()=>props.history.push('/pipeline')}
                                        >更多</div>
                                    </div>
                                </div>
                            }
                            overlayClassName="aside-dropdown"
                        >
                            <div className='aside-opt' data-title-right={isExpand ? null:pipeline?.name}>
                                <ListIcon
                                    isMar={false}
                                    text={pipeline?.name}
                                    colors={pipeline && pipeline?.color}
                                />
                                {isExpand &&
                                    <>
                                        <div className='aside-opt-name' title={pipeline?.name}>{pipeline?.name}</div>
                                        <div style={{opacity:0.8,fontSize:12}}><DownOutlined /></div>
                                    </>
                                }
                            </div>
                        </Dropdown>
                    }
                />
                <div className='arbess-layout-content'>
                    {
                        pipeline ?
                            renderRoutes(route.routes)
                            :
                            <div style={{paddingTop:50}}>
                                <ListEmpty />
                            </div>
                    }
                </div>
            </div>
            <ChangeRootUser
                domainId={pipelineId}
                visible={visible}
                setVisible={setVisible}
                onRefresh={findPipeline}
            />
        </Provider>
    )

}

export default inject("systemRoleStore")(observer(PipelineAside))

