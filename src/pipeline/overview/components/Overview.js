/**
 * @Description: 流水线概况
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React, {useEffect, useRef, useState} from "react";
import {Row, Col, Spin, Select} from "antd";
import {RightOutlined} from "@ant-design/icons";
import echarts from "../../../common/component/echarts/Echarts";
import statisticsStore from "../store/StatisticsStore";
import overviewStore from "../store/OverviewStore";
import historyStore from "../../history/store/HistoryStore";
import DynamicList from "../../../common/component/list/DynamicList";
import ListEmpty from "../../../common/component/list/ListEmpty";
import {runStatusIcon} from "../../history/components/HistoryCommon";
import "./Overview.scss";
import GaugeChart from "../../../common/component/echarts/GaugeChart";
import SearchSelect from "../../../common/component/search/SearchSelect";

const Overview = props =>{

    const {match:{params}} = props

    const {findRecentDaysFormatted,findRunResultSpan,findRunTimeSpan,findRunNumberSpan} = statisticsStore;
    const {findLogPageByTime} = overviewStore;
    const {findPipelineInstance} = historyStore;

    const chartRefs = {
        releaseTrend: useRef(null),
        resultTrend: useRef(null),
        numberTrend: useRef(null),
    }

    //加载状态
    const [spinning,setSpinning] = useState({
        logPage:false,
        pipelineInstance:false,
        resultTrend:false,
        releaseTrend:false,
        numberTrend:false,
    })
    //流水线动态
    const [dynamicList,setDynamicList] = useState([]);
    //最近发布
    const [instanceList,setInstanceList] = useState([]);
    //日期
    const [date,setDate] = useState(null);
    //运行统计请求参数
    const [runParams,setRunParams] = useState(0);

    useEffect(() => {
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
    },[])

    useEffect(() => {
        //结果次数统计
        // findRunResult('resultTrend');
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
        findLogPageByTime({data:{pipelineId:[params.id]},pageParam:{pageSize:10,currentPage:1}}).then(res=>{
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
        findPipelineInstance({pipelineId:params.id,pageParam:{pageSize:4,currentPage:1}}).then(res=>{
            if(res.code===0){
                setInstanceList(res.data?.dataList || [])
            }
        }).finally(()=>setSpinning(pev=>({...pev, [chartKey]: false})))
    }

    /**
     * 结果次数统计
     * @param chartKey
     */
    const findRunResult = (chartKey) => {
        setSpinning(pev=>({...pev, [chartKey]: true}));
        findRunResultSpan({pipelineId:params.id,countDay:runParams}).then(res=> {
            if(res.code===0){
                renderRunResultSpanChart(res.data,chartKey)
            }
        }).finally(()=>setSpinning(pev=>({...pev, [chartKey]: false})))
    }

    /**
     * 时间段统计
     */
    const findRunTime = (chartKey) => {
        setSpinning(pev=>({...pev, [chartKey]: true}));
        findRunTimeSpan({pipelineId:params.id,countDay:runParams}).then(res=> {
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
        findRunNumberSpan({pipelineId:params.id,countDay:runParams}).then(res=> {
            if(res.code===0){
                renderRunNumberSpanChart(res.data,chartKey)
            }
        }).finally(()=>setSpinning(pev=>({...pev, [chartKey]: false})))
    }

    //图表--流水线结果统计
    const renderRunResultSpanChart = (data, chartKey) => {
        const chartDom = chartRefs[chartKey].current;
        if(!chartDom){return;}
        let chart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
        // 限制最多只使用5条数据
        const limitedData = data ? data.slice(0, 4) : [];

        const option = {
            title: {
                text: '运行次数统计',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal',
                },
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: limitedData?.map(item=>item.pipeline?.name),
            },
            yAxis: [
                {type: 'value'}
            ],
            series:  [
                {
                    data: limitedData?.map(item=>item?.number || 0),
                    type: 'bar'
                }
            ]
        };
        chart.setOption(option);
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
                    fontWeight: 'normal',
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
                                                const {instanceId,findNumber,runStatus,runTimeDate,user,user:{nickname,name}} = item;
                                                return (
                                                    <div
                                                        key={instanceId}
                                                        className='instance-item'
                                                        onClick={()=>props.history.push(`/pipeline/${params.id}/history/${instanceId}`)}
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
                                onClick={()=>props.history.push(`/pipeline/${params.id}/dyna`)}
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

export default Overview
