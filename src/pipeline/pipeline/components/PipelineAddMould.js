/**
 * @Description: 流水线模板
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React, {useRef, useState} from "react";
import {NodeIndexOutlined} from "@ant-design/icons";
import "./PipelineAddMould.scss";
import {Col, Row} from "antd";
import {
    build_c_add, build_go, build_gradle,
    build_net_core, build_php, build_python, git,
    liunx, mvn, nodejs, script, sourcefare, testhubo
} from "../../../common/utils/Constant";

const PipelineAddMould = ({setTemplateType}) =>{

    const scrollRef = useRef(null);
    //类型
    const [mouldType,setMouldType] = useState('blank');
    //模版
    const [tmpType,setTmpType] = useState('blank-task')

    const template = [
        {
            id: "blank",
            title: "空模版",
            desc: [
                {
                    id: "blank-task",
                    title: '空任务',
                    templates: [],
                }
            ]
        },
        {
            id: "java",
            title: 'Java',
            desc: [
                {
                    id: 'maven-linux',
                    title: 'Maven · 构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['Maven构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[mvn]},
                        {types:[liunx]}
                    ]
                },
                {
                    id: 'maven-linux-test',
                    title: 'Maven · 扫描、测试、构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['代码扫描','自动化测试']},
                        {task: ['Maven构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[sourcefare,testhubo]},
                        {types:[mvn]},
                        {types:[liunx]}
                    ]
                },
                {
                    id: 'gradle-linux',
                    title: 'Gradle · 构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['Gradle构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[build_gradle]},
                        {types:[liunx]}
                    ]
                },
                {
                    id: 'gradle-linux-test',
                    title: 'Gradle · 扫描、测试、构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['代码扫描','自动化测试']},
                        {task: ['Gradle构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[sourcefare,testhubo]},
                        {types:[build_gradle]},
                        {types:[liunx]}
                    ]
                },
            ]
        },
        {
            id: "nodejs",
            title: "Node",
            desc: [
                {
                    id: 'nodejs-linux',
                    title: 'Node.js · 构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['Node.js构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[nodejs]},
                        {types:[liunx]}
                    ]
                },
                {
                    id: 'nodejs-linux-test',
                    title: 'Node.js · 扫描、测试、构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['代码扫描','自动化测试']},
                        {task: ['Node.js构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[sourcefare,testhubo]},
                        {types:[nodejs]},
                        {types:[liunx]}
                    ]
                },
            ]
        },
        {
            id: "go",
            title: "Go",
            desc: [
                {
                    id: 'go-linux',
                    title: 'Go · 构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['Go构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[build_go]},
                        {types:[liunx]}
                    ]
                },
                {
                    id: 'go-linux-test',
                    title: 'Go · 扫描、测试、构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['代码扫描','自动化测试']},
                        {task: ['Go构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[sourcefare,testhubo]},
                        {types:[build_go]},
                        {types:[liunx]}
                    ]
                },
            ]
        },
        {
            id: "python",
            title: "Python",
            desc: [
                {
                    id: 'python-linux',
                    title: 'Python · 构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['Python构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[build_python]},
                        {types:[liunx]}
                    ]
                },
                {
                    id: 'python-linux-test',
                    title: 'Python · 扫描、测试、构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['代码扫描','自动化测试']},
                        {task: ['Python构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[sourcefare,testhubo]},
                        {types:[build_python]},
                        {types:[liunx]}
                    ]
                },
            ]
        },
        {
            id: "php",
            title: "PHP",
            desc: [
                {
                    id: 'php-linux',
                    title: 'PHP · 构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['PHP构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[build_php]},
                        {types:[liunx]}
                    ]
                },
                {
                    id: 'php-linux-test',
                    title: 'PHP · 扫描、测试、构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['代码扫描','自动化测试']},
                        {task: ['PHP构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[sourcefare,testhubo]},
                        {types:[build_php]},
                        {types:[liunx]}
                    ]
                },
            ]
        },
        {
            id: "net_core",
            title: ".Net Core",
            desc: [
                {
                    id: 'net_core-linux',
                    title: '.Net Core · 构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['.Net Core构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[build_net_core]},
                        {types:[liunx]}
                    ]
                },
                {
                    id: 'net_core-linux-test',
                    title: '.Net Core · 扫描、测试、构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['代码扫描','自动化测试']},
                        {task: ['.Net Core构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[sourcefare,testhubo]},
                        {types:[build_net_core]},
                        {types:[liunx]}
                    ]
                },
            ]
        },
        {
            id: "c_add",
            title: "C++",
            desc: [
                {
                    id: 'c_add-linux',
                    title: 'C++ · 构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['C++构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[build_c_add]},
                        {types:[liunx]}
                    ]
                },
                {
                    id: 'c_add-linux-test',
                    title: 'C++ · 扫描、测试、构建、部署到主机环境',
                    step: [
                        {task: ['源码管理']},
                        {task: ['代码扫描','自动化测试']},
                        {task: ['C++构建']},
                        {task: ['主机部署']},
                    ],
                    templates:[
                        {types:[git]},
                        {types:[sourcefare,testhubo]},
                        {types:[build_c_add]},
                        {types:[liunx]}
                    ]
                },
            ]
        },
        {
            id: "other",
            title: "其他",
            desc: [
                {
                    id: 'other-script',
                    title: '其他 · 执行命令',
                    step: [
                        {task: ['执行脚本']},
                    ],
                    templates:[
                        {types:[script]},
                    ]
                },
            ]
        },
    ]

    /**
     * 切换模版
     */
    const changTemplate = (item) => {
        setTmpType(item.id);
        setTemplateType(item.templates);
    }

    /**
     * 锚点跳转
     * @param anchorName
     */
    const changeAnchor = anchorName =>{
        const scrollTop= scrollRef.current
        const anchorElement = document.getElementById(anchorName)
        if (anchorElement) {
            scrollTop.scrollTop = anchorElement.offsetTop
        }
        setMouldType(anchorName)
    }

    /**
     * 滚动加载
     */
    const onScroll = () =>{
        // 获取滚动区域元素到页面顶部的偏移offsetTop
        const offsets = template.map(item=>{
            return {
                id: item.id,
                offsetTop: document.getElementById(item.id)?.offsetTop
            }
        })
        // 获取滚动区域滚动的距离
        const scrollTop = scrollRef.current.scrollTop
        // 获取第一个符合要求的对象
        const ids = offsets.find(item=> item.offsetTop===scrollTop || item.offsetTop>scrollTop)
        if(!ids){
            return;
        }
        if(ids.id===mouldType){
            return;
        }
        setMouldType(ids.id)
    }

    return (
        <div className='pipeline-template'>
            <Row className='pipeline-add-mould'>
                <Col span={4} className='pipeline-add-mould-left'>
                    <div>
                        {
                            template.map(item=>(
                                <div
                                    key={item.id}
                                    className={`mould-group ${mouldType===item.id?'mould-group-select':''}`}
                                    onClick={()=>changeAnchor(item.id)}
                                >
                                    {item.title}
                                </div>
                            ))
                        }
                    </div>
                </Col>
                <Col span={20} className='pipeline-add-mould-right' ref={scrollRef} onScroll={onScroll}>
                    <div>
                        {
                            template.map(group=>(
                                <div key={group.id} id={group.id} className='mould-group'>
                                    <div className='mould-group-title'>
                                        {group.title}
                                    </div>
                                    <div className='mould-group-ul'>
                                        {
                                            group.desc.map(item=>(
                                                <div
                                                    key={item.id}
                                                    className={`mould-group-li ${tmpType===item.id ? 'mould-group-select':''}`}
                                                    onClick={()=>changTemplate(item)}
                                                >
                                                    <div className="mould-group-li-header">
                                                        <span className="li-header-icon"><NodeIndexOutlined /></span>
                                                        <span className="li-header-name">{item.title}</span>
                                                    </div>
                                                    {
                                                        item.step &&
                                                        <div className="mould-group-li-content">
                                                            {
                                                                item.step.map((step,index)=>(
                                                                    <div className="li-step" key={index}>
                                                                        {
                                                                            step.task.map((task,taskIndex)=>(
                                                                                <div key={taskIndex} className='li-step-task'>
                                                                                    <span className="li-step-name">{task}</span>
                                                                                </div>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </Col>
            </Row>
        </div>
    )

}

export default PipelineAddMould
