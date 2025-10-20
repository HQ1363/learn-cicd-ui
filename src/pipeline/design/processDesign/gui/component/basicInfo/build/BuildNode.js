/**
 * @Description: node构建
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/28
 */
import React from "react";
import FormsMirror from "../FormsMirror";
import FormsInput from "../FormsInput";
import FormsTool from "../FormsTool";
import {toolNode} from "../../../../../../../common/utils/Constant";

const BuildNode = props =>{

    return(
        <>
            <FormsTool
                scmType={toolNode}
            />
            <FormsInput
                name={"buildAddress"}
                placeholder={`"\/\" 代表当前源的根目录`}
                label={"构建路径"}
                addonBefore={"/"}
                tipText={true}
            />

            <FormsMirror
                name={"buildOrder"}
                label={"构建命令"}
                placeholder={"构建命令"}
            />

        </>
    )
}

export default BuildNode
