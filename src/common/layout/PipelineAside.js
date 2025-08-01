import React, {useEffect, useState} from 'react';
import {useRouteMatch} from "react-router-dom";
import {Dropdown, Spin} from "antd";
import ListIcon from "../component/list/ListIcon";
import {
    ApartmentOutlined,
    CaretDownOutlined,
    ClockCircleOutlined,
    CreditCardOutlined,
    ExperimentOutlined,
    RadarChartOutlined, SettingOutlined,
} from "@ant-design/icons";
import pipelineStore from "../../pipeline/pipeline/store/PipelineStore";
import Aside from "../component/aside/PipelineAside";
import {observer} from "mobx-react";
import SearchInput from "../component/search/SearchInput";
import ListEmpty from "../component/list/ListEmpty";

/**
 * 流水线侧边栏
 * @param props
 * @returns {Element}
 * @constructor
 */
const PipelineAside = (props) => {

    const {isExpand} = props;

    const {findUserPipelinePage,findRecentlyPipeline,pipeline} = pipelineStore;

    const match = useRouteMatch("/pipeline/:id");

    //流水线id
    const id = match?.params.id;
    //最近打开的流水线
    const [recentlyPipeline,setRecentlyPipeline] = useState([]);
    //最近打开的流水线下拉框
    const [dropdownVisible,setDropdownVisible] = useState(false);

    const firstRouters=[
        // {
        //     id:`/pipeline/${id}/overview`,
        //     to:`/pipeline/${id}/overview`,
        //     title:"概况",
        //     icon:<ApartmentOutlined />,
        // },
        {
            id:`/pipeline/${id}/config`,
            to:`/pipeline/${id}/config`,
            title: "设计",
            icon: <CreditCardOutlined />,
        },
        {
            id:`/pipeline/${id}/history`,
            to:`/pipeline/${id}/history`,
            title: "历史",
            icon: <ClockCircleOutlined />,
        },
        {
            id:`/pipeline/${id}/test`,
            to:`/pipeline/${id}/test/overview`,
            title: "测试报告",
            icon: <ExperimentOutlined />,
        },
        {
            id:`/pipeline/${id}/statistics`,
            to:`/pipeline/${id}/statistics/overview`,
            title: "统计",
            icon: <RadarChartOutlined />,
            isEnhance: true,
        },
        {
            id:`/pipeline/${id}/setting`,
            to:`/pipeline/${id}/setting`,
            title: "设置",
            icon: <SettingOutlined />,
        },
    ]

    useEffect(() => {
        if(id){
            findRecentlyPipeline({
                pipelineId:id,
                number:4,
            }).then(res=>{
                if(res.code===0){
                    setRecentlyPipeline(res.data)
                }
            })
        }
    }, [id,pipeline?.name]);

    /**
     * 切换流水线
     */
    const changePipeline = (item) => {
        if(id!==item.id){
            setDropdownVisible(false);
            setInputValue('');
            setIsSearch(false);
            props.history.push(`/pipeline/${item.id}/history`);
        }
    }

    //是否为搜索状态
    const [isSearch,setIsSearch] = useState(false);
    //加载
    const [spinning,setSpinning] = useState(false);
    //流水线
    const [pipelineData,setPipelineData] = useState({});
    //文本框内容
    const [inputValue,setInputValue] = useState('');

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
        <Aside
            {...props}
            id={id}
            backUrl={'/pipeline'}
            setUrl={`/pipeline/${id}/setting`}
            initRouters={firstRouters}
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
                                                                    <span className="pipeline-opt-name">
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
                                                        <span className="pipeline-opt-name">
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
                    <div className='aside-opt' data-title-right={isExpand?null:pipeline?.name}>
                        <ListIcon
                            isMar={false}
                            text={pipeline?.name}
                            colors={pipeline && pipeline?.color}
                        />
                        {isExpand &&
                            <>
                                <div className='aside-opt-name'>{pipeline?.name}</div>
                                <div style={{opacity:0.8}}><CaretDownOutlined/></div>
                            </>
                        }
                    </div>
                </Dropdown>
            }
        />
    )

}

export default observer(PipelineAside)
