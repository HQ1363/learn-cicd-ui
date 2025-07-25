/**
 * @Description: .net core构建
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/28
 */
import React from "react";
import FormsMirror from "../FormsMirror";
import FormsInput from "../FormsInput";
import {observer} from "mobx-react";

const BuildNetCore = props =>{

    return (
        <>
            <FormsInput
                name={"buildAddress"}
                placeholder={`"\/\" 代表当前源的根目录`}
                label={"项目地址"}
                addonBefore={"/"}
                tipText={true}
            />
            <FormsMirror
                name={"buildOrder"}
                label={"执行命令"}
                placeholder={"执行命令"}
            />
        </>
    )
}

export default observer(BuildNetCore)
