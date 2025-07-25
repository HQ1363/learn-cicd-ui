/**
 * @Description: 流水线侧边栏
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React, {useState} from "react";
import {PrivilegeButton} from "tiklab-privilege-ui";
import {renderRoutes} from 'react-router-config';
import "./PipelineSetAside.scss";
import {observer} from "mobx-react";
import {DownOutlined, UpOutlined} from "@ant-design/icons";

const PipelineTwoAside = props =>{

    const {route,projectRouters} = props

    const path = props.location.pathname;

    // 树的展开与闭合
    const [expandedTree,setExpandedTree] = useState([""])

    const isExpandedTree = key => expandedTree.some(item => item ===key)

    /**
     * 展开闭合树
     * @param key
     */
    const select = (key) => {
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key))
        }
    }

    const menuHtml = (item,deep) => {
        return (
            <PrivilegeButton key={item.id} code={item.purviewCode}>
                <div
                    key={item.id}
                    className={`project-nav-aside-item ${path === item.id ?"project-nav-aside-select":""} `}
                    onClick={()=>props.history.push(item.id)}
                    style={{paddingLeft: deep}}
                >
                    {item.title}
                </div>
            </PrivilegeButton>
        )
    }

    const renderMenuHtml = (item,deep) => {
        return (
            <div key={item.id} className='project-nav-aside-ul'>
                <div className="project-nav-aside-li" onClick={()=>select(item.id)} style={{paddingLeft: deep}}>
                    <div>{item.title}</div>
                    <div>
                        {
                            item.children ?
                                (isExpandedTree(item.id)?
                                        <DownOutlined style={{fontSize: "10px"}}/> :
                                        <UpOutlined style={{fontSize: "10px"}}/>
                                ): ""
                        }
                    </div>
                </div>
                <div className={`project-nav-aside-ul ${isExpandedTree(item.id)?"":"project-nav-aside-hidden"}`}>
                    {
                        item.children && item.children.map(item =>{
                            const deepnew = deep + 15
                            return item.children && item.children.length ?
                                renderMenuHtml(item,deepnew) : menuHtml(item,deepnew)
                        })
                    }
                </div>
            </div>
        )
    }

    return(
        <div className='project-nav'>
            <div className='project-nav-aside'>
                <div className='project-nav-aside-head'>
                    {route.path === '/statistics' && "统计"}
                </div>
                { projectRouters.map(item=>{
                    return item.children && item.children.length > 0 ?
                        renderMenuHtml(item,20) : menuHtml(item,20)
                }) }
            </div>
            <div className='project-nav-content'>
                { renderRoutes(route.routes) }
            </div>
        </div>
    )
}

export default observer(PipelineTwoAside)
