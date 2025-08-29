/**
 * @Description: 组件
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React, {useEffect, useState} from "react";
import {
    BellOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import PortalMessage from "./PortalMessage";
import {inject, observer} from "mobx-react";
import {getUser, productTitle, productImg, productWhiteImg} from "tiklab-core-ui";
import {renderRoutes} from "react-router-config";
import Profile from "../component/profile/Profile";
import menuBlack from '../../assets/images/menu-black.png';
import menuWhite from '../../assets/images/menu-white.png';
import './Portal.scss';

const Portal = props =>{

    const {route,history,systemRoleStore,HelpLink,AppLink,AvatarLink,customLogo=null,firstRouters} = props;

    const {getSystemPermissions} = systemRoleStore;

    const path = props.location.pathname;

    //是否折叠
    const [isExpand,setIsExpand] = useState(()=>{
        const expand = localStorage.getItem('menuExpand');
        return expand==='true'
    });
    //消息抽屉状态
    const [notificationVisibility,setNotificationVisibility] = useState(false);
    //未读
    const [unread,setUnread] = useState(0);
    //主题色
    const [themeType,setThemeType] = useState(() => {
        const theme = localStorage.getItem('theme');
        return theme  ? theme : 'default'; // 默认 false
    });

    useEffect(()=>{
        getSystemPermissions(getUser().userId);
    },[])

    /**
     * type三个参数为:
     * default(默认 --> --tiklab-gray-600)，
     * blue(蓝色 --> #2f5eb1)，
     * black(黑色 --> #131d30)
     */
    const changeTheme = type => {
        setThemeType(type)
        localStorage.setItem('theme',type)
    }

    /**
     * 跳转
     */
    const onSelect = item =>{
        history.push(item.to);
    }

    //设置图标
    const logoHtml = () => {
        const isDefaultTheme = themeType === 'default';
        const image = isDefaultTheme ? productImg.arbess : productWhiteImg.arbess;
        return {
            image: customLogo?.image ? customLogo.image : image,
            name: customLogo?.name ? customLogo.name :  productTitle.arbess
        };
    };

    //侧边导航
    const asideHtml = () => {
        if (path.startsWith('/setting') || (path.startsWith('/pipeline/') && path !== '/pipeline/')) {
            return null;
        }
        const logoData = logoHtml();
        return (
            <div className={`arbess-aside arbess-aside-normal arbess-aside-${themeType}`}>
                <div className='aside-logo' onClick={()=>history.push('/pipeline')}>
                    <img src={logoData.image} height={32} width={32} alt={''}/>
                </div>
                <div className="aside-up">
                    {
                        firstRouters.map(item=>(
                            <div key={item.key}
                                 className={`aside-item ${path.indexOf(item.key)===0 ? "aside-select":""}`}
                                 onClick={()=>onSelect(item)}
                            >
                                <div className="aside-item-icon">{item.icon}</div>
                                <div className="aside-item-title">{item.title}</div>
                            </div>
                        ))
                    }
                </div>
                <div className="aside-bottom">
                    <div className="aside-bottom-text text-icon" data-title-right={'消息'}
                         onClick={()=>setNotificationVisibility(!notificationVisibility)}
                    >
                        <BellOutlined className='aside-bottom-text-icon'/>
                    </div>
                    <PortalMessage
                        translateX={75}
                        history={history}
                        unread={unread}
                        setUnread={setUnread}
                        visible={notificationVisibility}
                        setVisible={setNotificationVisibility}
                    />
                    <HelpLink
                        bgroup={'arbess'}
                        iconComponent={
                            <div className="aside-bottom-text" data-title-right={'帮助与支持'}>
                                <QuestionCircleOutlined className='aside-bottom-text-icon'/>
                            </div>
                        }
                    />
                    <AppLink
                        translateX={75}
                        iconComponent={
                            <div className="aside-bottom-text" data-title-right={'应用'}>
                                <img src={themeType==='default'?menuBlack:menuWhite} alt="link" width="18" height="18"
                                     className='aside-bottom-text-icon'
                                >
                                </img>
                            </div>
                        }
                    />
                    <AvatarLink
                        {...props}
                        changeTheme={changeTheme}
                        iconComponent={
                            <div className="aside-bottom-text" data-title-right={'个人中心'}>
                                <Profile />
                            </div>
                        }
                    />
                </div>
            </div>
        )
    }

    return (
        <main className="arbess-layout">
            {asideHtml()}
            <div className='arbess-layout-content'>
                {renderRoutes(route.routes)}
            </div>
        </main>
    )
}

export default inject("systemRoleStore")(observer(Portal))



