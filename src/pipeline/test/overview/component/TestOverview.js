/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/6/24
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/6/24
 */
import React, {useEffect, useRef, useState} from "react";
import {Col, Row, Spin} from "antd";
import testCountStore from "../store/TestCountStore";
import "./TestOverview.scss";
import echarts from "../../../../common/component/echarts/Echarts";

const TestOverview = props => {

    const {match} = props;

    const {findTestCount,findTestCodeScanCount,findTestTestHuboCount} = testCountStore;

    const pipelineId = match.params.id;

    const chartRefs = {
        codeScanTrend: useRef(null),
        testhuboTrend: useRef(null),
    }

    //统计数据
    const [count,setCount] = useState({});
    //加载
    const [spinning,setSpinning] = useState({
        count:false,
        codeScanTrend:false,
        testhuboTrend:false,
    })

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
        //统计
        findCount()
        //代码扫描
        findCodeScan()
        //自动化测试
        findTesthubo()
    },[])

    /**
     * 统计
     */
    const findCount = () => {
        setSpinning(pev=>({...pev, count: true}));
        findTestCount(pipelineId).then(res=>{
            if(res.code===0){
                setCount(res.data)
            }
        }).finally(()=>{
            setSpinning(pev=>({...pev, count: false}));
        })
    }

    /**
     * 代码扫描
     */
    const findCodeScan = () => {
        setSpinning(pev=>({...pev, codeScanTrend: true}));
        findTestCodeScanCount(pipelineId).then(res=>{
            if(res.code===0){
                codeScanChart(res.data)
            }
        }).finally(()=>{
            setSpinning(pev=>({...pev, codeScanTrend: false}));
        })
    }

    /**
     * 自动化测试
     */
    const findTesthubo = () => {
        setSpinning(pev=>({...pev, testhuboTrend: true}));
        findTestTestHuboCount(pipelineId).then(res=>{
            if(res.code===0){
                testhuboChart(res.data)
            }
        }).finally(()=>{
            setSpinning(pev=>({...pev, testhuboTrend: false}));
        })
    }

    /**
     * 代码扫描
     */
    const codeScanChart = (data) => {
        const chartDom = chartRefs.codeScanTrend.current;
        if(!chartDom){return;}
        let chart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
        const option = {
            title: {
                text: '代码扫描统计',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal',
                },
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'horizontal',
                right: 0,
            },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: data?.allNumber || 0 , name: '全部' },
                        { value: data?.successNumber || 0, name: '成功' },
                        { value: data?.failNumber || 0, name: '失败' },
                    ],
                    color:['#5470C6', '#91CC75', '#f06f6f'],
                },

            ]
        };
        chart.setOption(option);

    }

    /**
     * 自动化测试
     */
    const testhuboChart = (data) => {
        const chartDom = chartRefs.testhuboTrend.current;
        if(!chartDom){return;}
        let chart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
        const option = {
            title: {
                text: '自动化测试统计',
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
                data: ['全部','成功','失败'],
            },
            yAxis: [
                {type: 'value'}
            ],
            series:  [
                {
                    data: [
                        data?.allNumber || 0,
                        data?.successNumber || 0,
                        data?.failNumber || 0,
                    ],
                    type: 'bar',
                    itemStyle: {
                        color: function(params) {
                            const colorList = ['#5470C6', '#91CC75', '#f06f6f'];
                            return colorList[params.dataIndex];
                        }
                    }
                }
            ]
        };
        chart.setOption(option);
    }

    /**
     * 跳转
     * @param path
     */
    const goPath = (path) => {
        props.history.push(`/pipeline/${pipelineId}/test/${path}`)
    }

    return (
        <Row className='test-home'>
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "24" }}
                xl={{ span: "22", offset: "1" }}
                xxl={{ span: "18", offset: "3" }}
            >
                <div className='arbess-home-limited'>
                    <div className='test-home-title'>测试统计</div>
                    <div className='home-count-box'>
                        <div className='home-count'>
                            <div className='home-count-item' onClick={()=>goPath('sonar')}>
                                <div className='home-count-item-label'>
                                    SonarQube
                                </div>
                                <div className='home-count-item-value'>
                                    {count?.sonarQubeNumber || '0' }
                                </div>
                            </div>
                            <div className='home-count-item' onClick={()=>goPath('sourceFare')}>
                                <div className='home-count-item-label'>
                                    SourceFare
                                </div>
                                <div className='home-count-item-value'>
                                    {count?.sourceFareNumbe || '0' }
                                </div>
                            </div>
                            <div className='home-count-item' onClick={()=>goPath('postIn')}>
                                <div className='home-count-item-label'>
                                   PostIn
                                </div>
                                <div className='home-count-item-value'>
                                    {count?.testHuboNumber || '0' }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='test-home-title'>测试统计详情</div>
                    <div className='home-statistics-box'>
                        <div className="home-statistics">
                            <Spin spinning={spinning.codeScanTrend}>
                                <div ref={chartRefs.codeScanTrend} style={{ height: 400 }} />
                            </Spin>
                        </div>
                        <div className="home-statistics">
                            <Spin spinning={spinning.testhuboTrend}>
                                <div ref={chartRefs.testhuboTrend} style={{ height: 400 }} />
                            </Spin>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    )
};

export default TestOverview
