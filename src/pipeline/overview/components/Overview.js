/**
 * @Description: 流水线概况
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React, {useEffect, useRef, useState} from "react";
import {Row, Col, Spin, Select, Tag, message, Space} from "antd";
import {RightOutlined} from "@ant-design/icons";
import echarts from "../../../common/component/echarts/Echarts";
import statisticsStore from "../store/StatisticsStore";
import overviewStore from "../store/OverviewStore";
import historyStore from "../../history/store/HistoryStore";
import DynamicList from "../../../common/component/list/DynamicList";
import ListEmpty from "../../../common/component/list/ListEmpty";
import {runStatusIcon} from "../../history/components/HistoryCommon";
import "./Overview.scss";
import SearchSelect from "../../../common/component/search/SearchSelect";
import {inject, observer} from "mobx-react";
import ListIcon from "../../../common/component/list/ListIcon";
import Profile from "../../../common/component/profile/Profile";
import pip_xingxing_kong from "../../../assets/images/svg/pip_xingxing_kong.svg";
import pip_xingxing from "../../../assets/images/svg/pip_xingxing.svg";
import pip_setting from "../../../assets/images/svg/pip_setting.svg";
import pip_date from "../../../assets/images/svg/pip_date.svg";
import pip_group from "../../../assets/images/svg/pip_group.svg";
import pip_env from "../../../assets/images/svg/pip_env.svg";
import pip_status from "../../../assets/images/svg/pip_status.svg";
import pip_success from "../../../assets/images/svg/pip_success.svg";
import pip_error from "../../../assets/images/svg/pip_error.svg";
import pip_halt from "../../../assets/images/svg/pip_halt.svg";

const Overview = props =>{

    const {match,pipelineStore} = props

    const {findRecentDaysFormatted,findRunTimeSpan,findRunNumberSpan,findPipelineInstanceCount} = statisticsStore;
    const {findLogPageByTime} = overviewStore;
    const {findPipelineInstance} = historyStore;
    const {pipeline} = pipelineStore;

    //流水线id
    const pipelineId = match.params.id;

    const chartRefs = {
        releaseTrend: useRef(null),
        resultTrend: useRef(null),
        numberTrend: useRef(null),
        instanceTrend: useRef(null),
    }

    //加载状态
    const [spinning,setSpinning] = useState({
        logPage:false,
        pipelineInstance:false,
        resultTrend:false,
        releaseTrend:false,
        numberTrend:false,
        instanceTrend:false,
    })
    //流水线动态
    const [dynamicList,setDynamicList] = useState([]);
    //最近发布
    const [instanceList,setInstanceList] = useState([]);
    //日期
    const [date,setDate] = useState(null);
    //运行统计请求参数
    const [runParams,setRunParams] = useState(0);
    //实例统计
    const [instanceCount,setInstanceCount] = useState({})

    useEffect(() => {
        //图表自适应浏览器
        const handleResize = () => {
            Object.keys(chartRefs).forEach((key) => {
                const chartDom = chartRefs[key].current;
                if (chartDom) {
                    const chart = echarts.getInstanceByDom(chartDom);
                    if (chart) {
                        chart.resize();
                    }
                }
            });
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            Object.keys(chartRefs).forEach((key) => {
                const chartDom = chartRefs[key].current;
                if (chartDom) {
                    const chart = echarts.getInstanceByDom(chartDom);
                    if (chart) {
                        chart.dispose();
                    }
                }
            });
        };
    }, []);

    useEffect(()=>{
        //流水动态
        findLogPage('logPage');
        //最近发布
        findInstance('pipelineInstance')
        //获取近十天的日期
        findRecentDaysFormatted().then(res=>{
            if(res.code===0){
                setDate(res.data);
            }
        })
        //实例统计
        setSpinning(pev=>({...pev, instanceTrend: true}));
        findPipelineInstanceCount(pipelineId).then(res=>{
            if(res.code===0){
                setInstanceCount(res.data);
                renderInstanceCountChart(res.data);
            }
        }).finally(()=>{
            setSpinning(pev=>({...pev, instanceTrend: false}));
        })
    },[])

    useEffect(() => {
        //时间段统计
        findRunTime('releaseTrend');
        //结果次数统计
        findRunNumber('numberTrend');
    }, [runParams]);

    /**
     * 流水动态
     */
    const findLogPage = (chartKey) => {
        setSpinning(pev=>({...pev, [chartKey]: true}));
        findLogPageByTime({data:{pipelineId:[pipelineId]},pageParam:{pageSize:10,currentPage:1}}).then(res=>{
            if(res.code===0){
                setDynamicList(res.data?.dataList || [])
            }
        }).finally(()=>setSpinning(pev=>({...pev, [chartKey]: false})))
    }

    /**
     * 最近发布
     * @param chartKey
     */
    const findInstance = (chartKey) => {
        setSpinning(pev=>({...pev, [chartKey]: true}));
        findPipelineInstance({pipelineId:pipelineId,pageParam:{pageSize:4,currentPage:1}}).then(res=>{
            if(res.code===0){
                setInstanceList(res.data?.dataList || [])
            }
        }).finally(()=>setSpinning(pev=>({...pev, [chartKey]: false})))
    }

    /**
     * 时间段统计
     */
    const findRunTime = (chartKey) => {
        setSpinning(pev=>({...pev, [chartKey]: true}));
        findRunTimeSpan({pipelineId:pipelineId,countDay:runParams}).then(res=> {
            if(res.code===0){
                renderRunTimeSpanChart(res.data,chartKey)
            }
        }).finally(()=>setSpinning(pev=>({...pev, [chartKey]: false})))
    }

    /**
     * 结果次数统计
     * @param chartKey
     */
    const findRunNumber = (chartKey) => {
        setSpinning(pev=>({...pev, [chartKey]: true}));
        findRunNumberSpan({pipelineId:pipelineId,countDay:runParams}).then(res=> {
            if(res.code===0){
                renderRunNumberSpanChart(res.data,chartKey)
            }
        }).finally(()=>setSpinning(pev=>({...pev, [chartKey]: false})))
    }

    //图表--时间段统计
    const renderRunTimeSpanChart = (data, chartKey) => {
        const chartDom = chartRefs[chartKey].current;
        if(!chartDom){return;}
        let chart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
        const option = {
            title: {
                text: '时间段统计',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal',
                },
            },
            tooltip: {trigger: 'axis'},
            legend: {data: ['全部', '成功', '失败']},
            color: ['#5470C6', '#91CC75', '#f06f6f'],
            xAxis: {
                type: 'category',
                data: data?.map(item=>item.time),
            },
            yAxis: [{type: 'value'}],
            series:  [
                {
                    name: '全部',
                    type: 'line',
                    data: data?.map(item => item.timeCount?.allNumber) || []
                },
                {
                    name: '成功',
                    type: 'line',
                    data: data?.map(item => item.timeCount?.successNumber) || []
                },
                {
                    name: '失败',
                    type: 'line',
                    data: data?.map(item => item.timeCount?.errNumber) || []
                }
            ]
        };
        chart.setOption(option);
    }

    //图表--结果次数统计
    const renderRunNumberSpanChart = (data, chartKey) => {
        const chartDom = chartRefs[chartKey].current;
        if(!chartDom){return;}
        let chart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
        const option = {
            title: {
                text: '结果次数统计',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                },
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: ['全部','成功','失败','终止'],
            },
            yAxis: [
                {type: 'value'}
            ],
            series:  [
                {
                    data: [
                        data?.allNumber || 0,
                        data?.successNumber || 0,
                        data?.errorNumber || 0,
                        data?.haltNumber || 0
                    ],
                    type: 'bar',
                    itemStyle: {
                        color: function(params) {
                            const colorList = ['#5470C6', '#91CC75', '#f06f6f', '#FAC858'];
                            return colorList[params.dataIndex];
                        }
                    }
                }
            ]
        };
        chart.setOption(option);
    }

    //图表--实例统计
    const renderInstanceCountChart = (data) => {
        const chartDom = chartRefs.instanceTrend.current;
        if(!chartDom){return;}
        let chart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);

        const option = {
            title: {
                text: '运行状态统计',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                },
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    color:['#91CC75', '#f06f6f', '#FAC858'],
                    data: [
                        { value: data?.successNumber || 0, name: '成功' },
                        { value: data?.errorNumber || 0, name: '失败' },
                        { value: data?.haltNumber || 0, name: '终止' },
                    ]
                },
                {
                    type: 'pie',
                    radius: ['0%', '30%'],
                    silent: true,
                    itemStyle: {
                        color: 'transparent',
                        borderWidth: 0
                    },
                    label: {
                        show: true,
                        position: 'center',
                        formatter: '全部\n{c}',
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#333'
                    },
                    data: [
                        { value: data?.allNumber || 0, name: '全部' }
                    ]
                }
            ]
        };
        chart.setOption(option);
    }

    return(
        <Row className="overview">
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "20", offset: "2" }}
                xxl={{ span: "18", offset: "3" }}
            >
                <div className="arbess-home-limited">
                    <div className='overview-top'>
                        <div className='overview-pipeline'>
                            <div className='overview-pipeline-up'>
                                <ListIcon
                                    text={pipeline?.name}
                                    colors={pipeline?.color}
                                />
                                <div className='overview-pipeline-up-info'>
                                    <div className='overview-up-name'>
                                        {pipeline?.name}
                                    </div>
                                    <div className='overview-up-info'>
                                        <div className='overview-up-info-item'>
                                            {pipeline?.power===1?'全局':'私有'}
                                        </div>
                                        <div className='overview-up-info-item'>
                                            <img
                                                src={pipeline?.collect === 0 ? pip_xingxing_kong : pip_xingxing}
                                                alt={"收藏"}
                                                width={15}
                                                height={15}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className='overview-pipeline-up-setting'
                                    onClick={()=>props.history.push(`/pipeline/${pipelineId}/setting/info`)}
                                >
                                    <img src={pip_setting} width={20} height={20}/>
                                </div>
                            </div>
                            <div className='overview-pipeline-center'>
                                <div className='overview-pipeline-item pipeline-space'>
                                    <Profile userInfo={pipeline?.user}/>
                                    <div className='overview-pipeline-item-value'>
                                        <div>
                                            {pipeline?.user?.nickname || '--'}
                                        </div>
                                        <div className='value-desc'>
                                            负责人
                                        </div>
                                    </div>
                                </div>
                                <div className='pipeline-space overview-pipeline-status'>
                                    <div className='overview-pipeline-item'>
                                        <div className='overview-pipeline-item-label'>
                                            <img src={pip_status} width={21} height={21} alt={''}/>
                                        </div>
                                        <div className='overview-pipeline-item-value'>
                                            <div className='value-value'>
                                                {instanceCount?.allNumber || 0}
                                            </div>
                                            <div className='value-desc'>
                                                全部
                                            </div>
                                        </div>
                                    </div>
                                    <div className='overview-pipeline-item'>
                                        <div className='overview-pipeline-item-label'>
                                            <img src={pip_success} width={21} height={21} alt={''}/>
                                        </div>
                                        <div className='overview-pipeline-item-value'>
                                            <div className='value-value'>
                                                {instanceCount?.successNumber || 0}
                                            </div>
                                            <div className='value-desc'>
                                                成功
                                            </div>
                                        </div>
                                    </div>
                                    <div className='overview-pipeline-item'>
                                        <div className='overview-pipeline-item-label'>
                                            <img src={pip_error} width={21} height={21} alt={''}/>
                                        </div>
                                        <div className='overview-pipeline-item-value'>
                                            <div className='value-value'>
                                                {instanceCount?.errorNumber || 0}
                                            </div>
                                            <div className='value-desc'>
                                                失败
                                            </div>
                                        </div>
                                    </div>
                                    <div className='overview-pipeline-item'>
                                        <div className='overview-pipeline-item-label'>
                                            <img src={pip_halt} width={21} height={21} alt={''}/>
                                        </div>
                                        <div className='overview-pipeline-item-value'>
                                            <div className='value-value'>
                                                {instanceCount?.haltNumber || 0}
                                            </div>
                                            <div className='value-desc'>
                                                终止
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='overview-pipeline-item pipeline-space'>
                                    <div className='overview-pipeline-item-label'>
                                        <img src={pip_date} width={21} height={21} alt={''}/>
                                    </div>
                                    <div className='overview-pipeline-item-value'>
                                        <div>
                                            {pipeline?.createTime}
                                        </div>
                                        <div className='value-desc'>
                                            创建时间
                                        </div>
                                    </div>
                                </div>
                                <div className='overview-pipeline-flex'>
                                    <div className='overview-pipeline-item'>
                                        <div className='overview-pipeline-item-label'>
                                            <img src={pip_group} width={21} height={21} alt={''}/>
                                        </div>
                                        <div className='overview-pipeline-item-value'>
                                            <div>
                                                {pipeline?.group?.groupName}
                                            </div>
                                            <div className='value-desc'>
                                                应用
                                            </div>
                                        </div>
                                    </div>
                                    <div className='overview-pipeline-item'>
                                        <div className='overview-pipeline-item-label'>
                                            <img src={pip_env} width={21} height={21} alt={''}/>
                                        </div>
                                        <div className='overview-pipeline-item-value'>
                                            <div>
                                                {pipeline?.env?.envName}
                                            </div>
                                            <div className='value-desc'>
                                                环境
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='overview-quick-entrance'>
                            <Spin spinning={spinning.instanceTrend}>
                                <div ref={chartRefs.instanceTrend} style={{ height: '100%' }} />
                            </Spin>
                        </div>
                    </div>
                    <div className="overview-upper">
                        <div className='overview-guide-title'>
                            最近发布
                        </div>
                        <div className="overview-upper-content">
                            {
                                instanceList && instanceList.length > 0 ?
                                    <div className='overview-upper-instance'>
                                        {
                                            instanceList.map(item=>{
                                                const {instanceId,findNumber,runStatus,runTimeDate} = item;
                                                return (
                                                    <div
                                                        key={instanceId}
                                                        className='instance-item'
                                                        onClick={()=>props.history.push(`/pipeline/${pipelineId}/history/${instanceId}`)}
                                                    >
                                                        <div className='instance-item-up'>
                                                            <div className='instance-item-findNumber'># {findNumber}</div>
                                                        </div>
                                                        <div className='instance-item-center'>
                                                            <div className='instance-item-center-info'>
                                                                <div>状态</div>
                                                                <div className='instance-item-runStatus'>{runStatusIcon(runStatus)}</div>
                                                            </div>
                                                            <div className='instance-item-center-info'>
                                                                <div>耗时</div>
                                                                <div>{runTimeDate}</div>
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
                        </div>
                    </div>
                    <div className='overview-center'>
                        <div className='overview-guide'>
                            <div className='overview-guide-title'>
                                运行统计
                            </div>
                            <SearchSelect
                                value={runParams}
                                style={{width:120}}
                                onChange={value=>setRunParams(value)}
                            >
                                {
                                    date && date.map((value,index)=>(
                                        <Select.Option key={index} value={index}>{value}</Select.Option>
                                    ))
                                }
                            </SearchSelect>
                        </div>
                        <div className='overview-center-content'>
                            <div className="overview-center-release">
                                <Spin spinning={spinning['numberTrend']}>
                                    <div ref={chartRefs['numberTrend']} style={{ height: 460 }} />
                                </Spin>
                            </div>
                            <div className="overview-center-release">
                                <Spin spinning={spinning['releaseTrend']}>
                                    <div ref={chartRefs['releaseTrend']} style={{ height: 460 }} />
                                </Spin>
                            </div>
                        </div>
                    </div>
                    <div className='overview-bottom'>
                        <div className='overview-guide'>
                            <div className='overview-guide-title'>
                                动态
                            </div>
                            <RightOutlined
                                className='overview-bottom-right'
                                onClick={()=>props.history.push(`/pipeline/${pipelineId}/dyna`)}
                            />
                        </div>
                        <div className='overview-bottom-box'>
                            <Spin spinning={spinning.logPage}>
                                <DynamicList dynamicList={dynamicList}/>
                            </Spin>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default inject("pipelineStore")(observer(Overview))

