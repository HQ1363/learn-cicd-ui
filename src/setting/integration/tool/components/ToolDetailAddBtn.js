/**
 * @Description: 工具添加按钮
 * @Author: gaomengyuan
 * @Date: 2025/2/8
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/2/8
 */
import React from "react";
import Button from "../../../../common/component/button/Button";
import ToolDetailModal from "./ToolDetailModal";

const ToolDetailAddBtn = (props) => {

    const {isConfig,scmType,visible,setVisible,formValue,setFormValue,findAllScm} = props

    /**
     * 添加工具
     */
    const addTool = () =>{
        setVisible(true)
        if(formValue){
            setFormValue(null)
        }
    }

    return (
        <>
            <Button
                onClick={addTool}
                type={isConfig? "row":"primary"}
                title={isConfig? "添加":"添加工具"}
            />
            <ToolDetailModal
                visible={visible}
                setVisible={setVisible}
                formValue={formValue}
                findAllScm={findAllScm}
                scmType={scmType}
                isConfig={isConfig}
            />
        </>
    )
}

export default ToolDetailAddBtn;
