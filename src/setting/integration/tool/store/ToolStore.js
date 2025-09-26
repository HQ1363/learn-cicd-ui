import React from "react";
import {action} from "mobx";
import {message} from "antd";
import {Axios} from "tiklab-core-ui";

class ToolStore {

    /**
     * 获取环境配置
     * @returns {Promise<*>}
     */
    @action
    findAllPipelineScm = async () =>{
        return await Axios.post("/scm/findAllPipelineScm")
    }

    /**
     * 获取环境配置
     */
    @action
    findPipelineScmPage = async value =>{
        return await Axios.post("/scm/findPipelineScmPage",value)
    }

    /**
     * 获取环境配置
     */
    @action
    findPipelineScmList = async value =>{
        return await Axios.post("/scm/findPipelineScmList",value)
    }

    /**
     * 删除环境配置
     * @param value
     * @returns {Promise<*>}
     */
    @action
    deletePipelineScm = async value=>{
        const param = new FormData()
        param.append("scmId",value)
        const data = await Axios.post("/scm/deletePipelineScm",param)
        if(data.code===0){
            message.success(`删除成功`)
        } else {
            message.error(`删除失败`)
        }
        return data
    }

    /**
     * 更新环境配置
     * @param values
     * @returns {Promise<*>}
     */
    @action
    updatePipelineScm = async values=>{
        const data = await Axios.post("/scm/updatePipelineScm",values)
        if(data.code === 0){
            message.success(`${values.scmId?'修改':'添加'}成功`)
        } else if(data.code===40000){
            message.error({
                content: (
                    <>
                        {data.msg}具体可查看
                        <a href="https://doc.tiklab.net/document/322b16350ed8/dbc36f6f763a" target="_blank">
                            https://doc.tiklab.net
                        </a>
                    </>
                )
            })
        } else {
            message.error(`${values.scmId?'修改':'添加'}失败`)
        }
        return data
    }

    /**
     * 工具集成统计
     * @returns {Promise<*>}
     */
    @action
    findScmByTypeGroup = async ()=>{
        return await Axios.post("/scm/findScmByTypeGroup")
    }

    /**
     * 下载
     * @returns {Promise<*>}
     */
    @action
    downloadFile = async value =>{
        return await Axios.post("/scm/file/downloadFile",value)
    }

    /**
     * 下载
     * @returns {Promise<*>}
     */
    @action
    downloadAndInstall = async value=>{
        return await Axios.post("/scm/file/downloadAndInstall",value)
    }

    /**
     * 下载状态
     * @returns {Promise<*>}
     */
    @action
    findScmRemoteFile = async value=>{
        const param = new FormData()
        param.append("id",value)
        return await Axios.post("/scm/file/findScmRemoteFile",param)
    }

}

const toolStore = new ToolStore();
export default toolStore

