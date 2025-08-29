/**
 * @Description: 流水线删除
 * @Author: gaomengyuan
 * @Date: 2025/6/23
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/6/23
 */
import React, {useState} from "react";
import {Input, Spin} from "antd";
import Modals from "../../../common/component/modal/Modal";
import pipelineStore from "../store/PipelineStore";
import "./PipelineDelete.scss";
import {deleteSuccessReturnCurrenPage} from "../../../common/utils/Client";

const PipelineDelete = (props) => {

    const {delVisible,setDelVisible,pipeline,changPage,page} = props;

    const {deletePipeline}=pipelineStore;

    //删除文本框内容
    const [delValue,setDelValue] = useState("")
    //删除效验提示内容
    const [delError,setDelError] = useState(null)
    //删除加载状态
    const [isLoading,setIsLoading] = useState(false)

    /**
     * 关闭删除流水线弹出框
     */
    const onCancel = () =>{
        if(!isLoading){
            setIsLoading(false)
            setDelVisible(false)
            setDelValue("")
            setDelError(null)
        }
    }

    /**
     * 删除流水线
     */
    const delPipeline = () =>{
        if(isLoading){
            return;
        }
        if(delValue.trim()==="" || delValue!==pipeline.name){
            setDelError("流水线名称错误")
            return;
        }
        setIsLoading(true)
        deletePipeline(pipeline.id).then(()=>{
            onCancel()
            if(typeof changPage === 'function'){
                const current = deleteSuccessReturnCurrenPage(page.totalRecord,15,page.currentPage)
                changPage(current)
            } else {
                props.history.push("/pipeline")
            }
        })
    }

    return (
        <Modals
            visible={delVisible}
            onCancel={onCancel}
            onOk={delPipeline}
            title={"删除流水线"}
            okText={'确认删除'}
            okType={'dangerous'}
        >
            <Spin spinning={isLoading} tip="删除中...">
                <div className="pipelineReDel-modal">
                    <div className="pipelineReDel-modal-warn">危险：流水线删除无法恢复！请慎重操作！</div>
                    <div className="pipelineReDel-modal-warn">
                        <div>该操作将永久删除流水线<span className="warn-pipeline"> {pipeline?.name} </span>的相关数据，包括（配置、历史、制品）等。</div>
                        <div className="warn-continue">为防止意外，确认继续操作请输入以下内容：</div>
                        <div className="warn-pipeline-title">{pipeline?.name}</div>
                    </div>
                    <div className="pipelineReDel-modal-input">
                        <Input
                            className={`${delError? "inputs-error":""}`}
                            placeholder="请输入提示内容以确认继续操作"
                            onChange={e=>setDelValue(e.target.value)}
                            value={delValue}
                        />
                    </div>
                    <div className="pipelineReDel-modal-error">
                        {delError}
                    </div>
                </div>
            </Spin>
        </Modals>
    )
}

export default PipelineDelete
