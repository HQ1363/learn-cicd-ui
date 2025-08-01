/**
 * @Description: 主机命令
 * @Author: gaomengyuan
 * @Date: 2025/7/29
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/7/29
 */
import React from "react";
import FormsAuth from "../FormsAuth";
import FormsMirror from "../FormsMirror";

const HostOrder = (props) => {

    return (
        <>
            <FormsAuth />
            <FormsMirror
                name={"order"}
                label={"执行命令"}
                placeholder={"执行命令"}
            />
        </>
    )
}

export default HostOrder

