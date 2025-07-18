/**
 * @Description: 流水线添加
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React, {useRef, useState} from "react";
import {Spin, Steps, Row, Col} from "antd";
import {getUser} from "tiklab-core-ui";
import Button from "../../../common/component/button/Button";
import PipelineAddMould from "./PipelineAddMould";
import PipelineAddInfo from "./PipelineAddInfo";
import pipelineStore from "../store/PipelineStore";
import Modal from "../../../common/component/modal/Modal";
import "./pipelineAdd.scss";

const PipelineAdd = props =>{

    const {visible,setVisible} = props;

    const {createPipeline} = pipelineStore;
    const user = getUser();
    const pipelineAddInfoRef = useRef(null);

    //添加状态
    const [isLoading,setIsLoading] = useState(false)
    //当前步骤
    const [current,setCurrent] = useState(0)
    //流水线模板 -- 下标
    const [templateType,setTemplateType] = useState(1)
    //基本信息
    const [baseInfo,setBaseInfo] = useState({
        power:1,type:2,group:{id:'default'},env:{id:'default'},
        userList:[{
            ...user,
            id: user.userId,
            roleType: 2
        }]
    })

    /**
     * 创建流水线
     */
    const createPip = () => {
        const {userList,...rest} = baseInfo
        const params = {
            ...rest,
            template:templateType,
            userList: userList && userList.map(item=>({userId:item.id,roleType:item.roleType})),
        }
        setIsLoading(true)
        createPipeline(params).then(res => {
            if (res.code===0) {
                props.history.push(`/pipeline/${res.data}/config`)
            }
        }).finally(()=>setIsLoading(false))
    }

    /**
     * 下一步
     */
    const okNext = () => {
        if (pipelineAddInfoRef.current) {
            pipelineAddInfoRef.current.onOk();
        }
    }

    /**
     * 关闭弹出框
     */
    const onCancel = ()=>{
        if (pipelineAddInfoRef.current) {
            pipelineAddInfoRef.current.onRest();
        }
        setVisible(false);
        setCurrent(0);
    }

    // 渲染模板
    const renderTemplate = (
           <div className="pipeline-template">
               <div className="template-base">
                   <span>流水线名称：</span>
                   <span>{baseInfo.name}</span>
               </div>
               <div className="template-base">
                   <span>流水线权限：</span>
                   <span>{baseInfo.power===1?"全局":"私有"}</span>
               </div>
               <PipelineAddMould
                   templateType={templateType}
                   setTemplateType={setTemplateType}
               />
           </div>
    )

    // 完善信息
    const renderInfo = (
        <PipelineAddInfo
            {...props}
            set={false}
            ref={pipelineAddInfoRef}
            setCurrent={setCurrent}
            baseInfo={baseInfo}
            setBaseInfo={setBaseInfo}
        />
    )

    const steps = [
        {
            title: "完善信息",
            content: renderInfo
        },
        {
            title: "选择模板",
            content: renderTemplate
        },
    ]

    return (
        <Modal
            className="pipeline-add"
            title={'添加流水线'}
            visible={visible}
            width={600}
            onCancel={onCancel}
            destroyOnClose
            footer={
                current === 0 ?
                    <>
                        <Button onClick={onCancel} title={"取消"} isMar={true}/>
                        <Button type={"primary"} title={"下一步"} onClick={okNext}/>
                    </>
                    :
                    <>
                        <Button onClick={onCancel} title={"取消"} isMar={true}/>
                        <Button onClick={()=>setCurrent(0)} title={"上一步"} isMar={true}/>
                        <Button type={"primary"} onClick={createPip} title={"确定"}/>
                    </>
            }
        >
            <Spin spinning={isLoading}>
                <div className="steps-top">
                    <Steps current={current}>
                        {steps.map(item => (
                            <Steps.Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                </div>
                <div className="steps-content">
                    {steps[current].content}
                </div>
            </Spin>
        </Modal>
    )

}

export default PipelineAdd
