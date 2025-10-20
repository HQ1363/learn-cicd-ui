/**
 * @Description: c++构建
 * @Author: gaomengyuan
 * @Date: 2025/8/11
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/8/11
 */
import React from "react";
import FormsMirror from "../FormsMirror";
import FormsInput from "../FormsInput";
import {observer} from "mobx-react";
import {toolCAdd} from "../../../../../../../common/utils/Constant";
import FormsTool from "../FormsTool";

const BuildCAdd = props =>{

    //自定义语法高亮
    const defineMode = {
        name: "cAdd",
        fn: function(config, options) {
            return {
                token: function(stream, state) {
                    if (stream.match(/^#.*/)) {
                        return "comment";
                    }
                    if (stream.match(/(g\+\+|clang\+\+|c\+\+)(?=\s|$)/)) {
                        return "builtin";
                    }
                    if (stream.match(/\b(make|cmake)\b/)) {
                        return "builtin";
                    }
                    stream.next();
                    return null;
                }
            };
        }
    };

    return(
        <>
            <FormsTool
                scmType={toolCAdd}
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
                language={'cAdd'}
                defineMode={defineMode}
            />
        </>
    )
}

export default observer(BuildCAdd)
