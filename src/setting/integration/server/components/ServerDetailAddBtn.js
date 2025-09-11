/**
 * @Description: 服务配置添加按钮
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React from "react";
import Button from "../../../../common/component/button/Button";
import ServerDetailModal from "./ServerDetailModal";

const ServerDetailAddBtn = props =>{

    const {isConfig,visible,setVisible,formValue,setFormValue,findAuth,type} = props

    /**
     * 添加按钮操作
     */
    const addServerBtn = () =>{
        setVisible(true)
        if(formValue){
            setFormValue(null)
        }
    }

    return(
        <>
            <Button
                onClick={addServerBtn}
                type={isConfig?"row":"primary"}
                title={isConfig?"添加":"添加服务"}
            />
            <ServerDetailModal
                type={type}
                visible={visible}
                setVisible={setVisible}
                formValue={formValue || null}
                findAuth={findAuth}
                isConfig={isConfig}
            />
        </>
    )
}

export default ServerDetailAddBtn
