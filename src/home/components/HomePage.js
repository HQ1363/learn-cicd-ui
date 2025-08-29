/**
 * @Description: 首页
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React,{useEffect,useState,useRef} from "react";
import {Col, Row, Spin, Table, Select} from "antd";
import homePageStore from "../store/HomePageStore";
import statisticsStore from "../../pipeline/overview/store/StatisticsStore";
import ListEmpty from "../../common/component/list/ListEmpty";
import ListIcon from "../../common/component/list/ListIcon";
import echarts from "../../common/component/echarts/Echarts";
import Profile from "../../common/component/profile/Profile";
import SearchSelect from "../../common/component/search/SearchSelect";
import "./HomePage.scss";

const HomePage = props =>{

    const {findOpenPage} = homePageStore;
    const {findRunTimeSpan,findRunResultSpan,findDayRateCount,findRecentDaysFormatted,findRunNumberSpan} = statisticsStore;

    const chartRefs = {
        releaseTrend: useRef(null),
        resultTrend: useRef(null),
        numberTrend: useRef(null),
    }

    //最近构建的流水线列表
    const [newlyOpen,setNewlyOpen] = useState([]);
    //加载
    const [spinning,setSpinning] = useState({
        allOpen:false,
        resultTrend:false,
        releaseTrend:false,
        numberTrend:false,
        dayRateUserTrend:false,
        dayRatePipelineTrend:false,
    })
    //发布次数TOP1
    const [releaseUserTop,setReleaseUserTop] = useState(null);
    const [releasePipelineTop,setReleasePipelineTop] = useState(null);
    //日期
    const [date,setDate] = useState(null);
    //运行统计请求参数
    const [runParams,setRunParams] = useState(0);
    //发布次数TOP10统计
    const [rayRateParams,setRayRateParams] = useState(0);

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
        //常用流水线
        findOpen('allOpen');
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

    useEffect(() => {
        //发布次数TOP10统计
        findDayRate('dayRatePipelineTrend','pipeline');
        findDayRate('dayRateUserTrend','user');
    }, [rayRateParams]);

    /**
     * 获取常用流水线
     */
    const findOpen = (chartKey) => {
        setSpinning(pev=>({...pev, [chartKey]: true}));
        findOpenPage({
            pageParam:{pageSize:4,currentPage:1},
        }).then(res=> {
            if(res.code===0){
                setNewlyOpen(res?.data?.dataList || [])
            }
        }).finally(()=>setSpinning(pev=>({...pev, [chartKey]: false})))
    }

    /**
     * 结果次数统计
     * @param chartKey
     */
    const findRunResult = (chartKey) => {
        setSpinning(pev=>({...pev, [chartKey]: true}));
        findRunResultSpan({countDay:runParams}).then(res=> {
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
        findRunTimeSpan({countDay:runParams}).then(res=> {
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
        findRunNumberSpan({countDay:runParams}).then(res=> {
            if(res.code===0){
                renderRunNumberSpanChart(res.data,chartKey)
            }
        }).finally(()=>setSpinning(pev=>({...pev, [chartKey]: false})))
    }

    /**
     * 发布次数TOP10统计
     */
    const findDayRate = (chartKey,type) => {
        setSpinning(pev=>({...pev, [chartKey]: true}));
        findDayRateCount({countDay:rayRateParams,type}).then(res=> {
            if(res.code===0){
                if(type==='user'){
                    setReleaseUserTop(res.data)
                } else{
                    setReleasePipelineTop(res.data)
                }
            }
        }).finally(()=>setSpinning(pev=>({...pev, [chartKey]: false})))
    }

    //图表--流水线结果统计
    const renderRunResultSpanChart = (data, chartKey) => {
        const chartDom = chartRefs[chartKey].current;
        if(!chartDom){return;}
        let chart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
        // 限制最多只使用5条数据
        const limitedData = data ? data.slice(0, 5) : [];

        const option = {
            title: {
                text: '时间段统计',
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

    //发布次数TOP10统计
    const columns = [
        {
            title: '总数',
            dataIndex: 'allNumber',
            key: 'allNumber',
            width:"17%",
            ellipsis:true,
        },
        {
            title: '成功数',
            dataIndex: 'successNumber',
            key: 'successNumber',
            width:"17%",
            ellipsis:true,
            render: text=><span className='home-release-success'>{text}</span>
        },
        {
            title: '失败数',
            dataIndex: 'errorNumber',
            key: 'errorNumber',
            width:"17%",
            ellipsis:true,
            render: text=><span className='home-release-error'>{text}</span>
        },
        {
            title: '成功率',
            dataIndex: 'successRate',
            key: 'successRate',
            width:"17%",
            ellipsis:true,
        },
    ]

    return(
        <Row className="homePage" >
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "20", offset: "2" }}
                xxl={{ span: "18", offset: "3" }}
            >
                <div className="homePage-content arbess-home-limited">
                    <div className="home-recent">
                        <div className="homePage-guide-title">
                            常用流水线
                        </div>
                        <Spin spinning={spinning.allOpen}>
                            {
                                newlyOpen && newlyOpen.length > 0 ?
                                    <div className="pipelineRecent-content">
                                        {
                                            newlyOpen.map(item=> {
                                                const {pipeline,execStatus} = item
                                                return(
                                                    <div className="pipelineRecent-item" key={pipeline?.id}
                                                         onClick={()=> props.history.push(`/pipeline/${pipeline?.id}/history`)}
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
                    <div className="home-statistics">
                        <div className='homePage-guide'>
                            <div className="homePage-guide-title">
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
                        <div className='home-statistics-content'>
                            <div className="home-statistics-release">
                                <Spin spinning={spinning['numberTrend']}>
                                    <div ref={chartRefs['numberTrend']} style={{ height: 460 }} />
                                </Spin>
                            </div>
                            <div className="home-statistics-release">
                                <Spin spinning={spinning['releaseTrend']}>
                                    <div ref={chartRefs['releaseTrend']} style={{ height: 460 }} />
                                </Spin>
                            </div>
                        </div>
                    </div>
                    <div className="home-release">
                        <div className='homePage-guide'>
                            <div className="homePage-guide-title">
                                发布次数TOP10统计
                            </div>
                            <SearchSelect
                                value={rayRateParams}
                                style={{width:120}}
                                onChange={value=>setRayRateParams(value)}
                            >
                                {
                                    date && date.map((value,index)=>(
                                        <Select.Option key={index} value={index}>{value}</Select.Option>
                                    ))
                                }
                            </SearchSelect>
                        </div>
                        <div className="home-release-content">
                            <div className='home-release-pipeline'>
                                <div className='home-release-title'>流水线发布次数统计</div>
                                <Table
                                    loading={spinning.dayRatePipelineTrend}
                                    columns={[
                                        {
                                            title: '流水线',
                                            dataIndex: ['pipeline','name'],
                                            key: ['pipeline','name'],
                                            width:"32%",
                                            ellipsis:true,
                                            render: (text, record) => (
                                                <span
                                                    className='home-release-link'
                                                    onClick={()=>props.history.push(`/pipeline/${record.pipeline?.id}/history`)}
                                                >
                                                    <ListIcon
                                                        text={text}
                                                        colors={record.pipeline?.color}
                                                        isMar={false}
                                                    />
                                                    <span className='home-release-link-text'>{text}</span>
                                                </span>
                                            )
                                        },
                                        ...columns,
                                    ]}
                                    pagination={false}
                                    locale={{emptyText: <ListEmpty/>}}
                                    rowKey={record=>record?.pipeline?.id}
                                    dataSource={releasePipelineTop}
                                />
                            </div>
                            <div className='home-release-user'>
                                <div className='home-release-title'>用户发布次数统计</div>
                                <Table
                                    loading={spinning.dayRateUserTrend}
                                    rowClassName='arbess-user-avatar'
                                    columns={[
                                        {
                                            title: '用户',
                                            dataIndex: ['user','nickname'],
                                            key: ['user','nickname'],
                                            width:"32%",
                                            ellipsis:true,
                                            render: (text, record) => (
                                                <span className='home-release-user-name'>
                                                    <Profile
                                                        userInfo={record.user}
                                                    />
                                                    <span className='home-release-user-name-text'>{text}</span>
                                                </span>
                                            )
                                        },
                                        ...columns,
                                    ]}
                                    pagination={false}
                                    locale={{emptyText: <ListEmpty/>}}
                                    rowKey={record=>record?.user?.id}
                                    dataSource={releaseUserTop}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </Col>
        </Row>
    )
}

export default HomePage
