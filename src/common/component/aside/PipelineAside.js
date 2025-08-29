/**
 * @Description: 流水线侧边栏
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React, {useState, useEffect} from 'react';
import {
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import {observer} from "mobx-react";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";

const PipelineAside = (props) => {

    const {isExpand,setIsExpand,themeType,initRouters,backUrl,ChangeComponent,domainId} = props;

    const path = props.location.pathname;

    //路由
    const [pipelineRouters,setPipelineRouters] = useState(initRouters);
    //更多路由
    const [moreMenu, setMoreMenu] = useState([]);

    useEffect(() => {
        setPipelineRouters(initRouters)
    }, [domainId]);

    /**
     * 折叠
     */
    const changeExpand = () =>{
        setIsExpand(!isExpand)
        localStorage.setItem('menuExpand',String(!isExpand))
    }

    /**
     * 跳转
     */
    const onSelect = (item) => {
        props.history.push(item.to)
    }

    /**
     * 返回
     */
    const goBack = () => {
        props.history.push(backUrl)
    }

    return (
        <div className={`arbess-aside ${isExpand ? 'arbess-aside-expand': 'arbess-aside-normal'} arbess-aside-${themeType}`}>
            {ChangeComponent}
            <div className="aside-up">
                {
                    isExpand ?
                        <div className="aside-item-back">
                            <div className='aside-item' onClick={goBack}>
                                <div className="aside-item-icon">
                                    <HomeOutlined />
                                </div>
                                <div className="aside-item-title">返回首页</div>
                            </div>
                        </div>
                        :
                        <div className="aside-item-back">
                            <div className='aside-item-back-home' data-title-right='返回首页' onClick={goBack}>
                                <div className="aside-item-home-icon">
                                    <HomeOutlined />
                                </div>
                            </div>
                        </div>
                }
                {
                    pipelineRouters.map(item=>(
                        <PrivilegeProjectButton key={item.id} domainId={domainId} code={item.purviewCode}>
                            <div key={item.id}
                                 className={`aside-item ${path.indexOf(item.id) === 0 ? "aside-select":""}`}
                                 onClick={()=>onSelect(item)}
                            >
                                <div className="aside-item-icon">{item.icon}</div>
                                <div className="aside-item-title">{item.title}</div>
                            </div>
                        </PrivilegeProjectButton>
                    ))
                }
            </div>
            <div className="aside-bottom">
                {
                    isExpand ?
                        <div className='aside-item' onClick={changeExpand}>
                            <div className="aside-item-icon"><MenuFoldOutlined /></div>
                            <div className="aside-item-title">折叠</div>
                        </div>
                        :
                        <div className="aside-bottom-text" data-title-right='展开' onClick={changeExpand}>
                            <MenuUnfoldOutlined className='aside-bottom-text-icon'/>
                        </div>
                }
            </div>
        </div>
    )
}

export default observer(PipelineAside)
