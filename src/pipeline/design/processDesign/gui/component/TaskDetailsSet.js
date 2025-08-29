/**
 * @Description: 任务详情高级设置
 * @Author: gaomengyuan
 * @Date: 2025/6/6
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/6/6
 */
import React, {useEffect, useState} from "react";
import Variable from "./variable/Variable";
import Message from "./message/Message";
import Button from "../../../../../common/component/button/Button";
import countStore from "../../../../../setting/home/store/CountStore";
import {getUser} from "tiklab-core-ui";
import {pipeline_task_update} from "../../../../../common/utils/Constant";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";

const TaskDetailsSet = (props) => {

    const {dataItem,pipeline} = props;

    const {findTaskCount} = countStore;

    const user = getUser()

    //任务统计
    const [count,setCount] = useState(null);
    //高级设置标签
    const [settingType,setSettingType] = useState('variable');
    //变量需要的数据
    const [formObj,setFormObj] = useState(null);

    useEffect(() => {
        //任务统计
        findCount()
    }, []);

    /**
     * 任务统计
     */
    const findCount = () => {
        findTaskCount({
            pipelineId: pipeline.id,
            taskId: dataItem.taskId
        }).then(res=>{
            if(res.code===0){
                setCount(res.data)
            }
        })
    }

    /**
     * 改变标签
     */
    const changeSettingType = (type) => {
        setSettingType(type);
        setFormObj(null);
    }

    /**
     * 添加
     */
    const addInput = () => {
        switch (settingType) {
            case 'variable':
                setFormObj({
                    var:"add",
                })
                break;
            case 'message':
                const {userId,nickname,name} = user;
                setFormObj({
                    pose:'add',
                    noticeType:1,
                    userList:[{user:{id:userId,nickname,name}}],
                    typeList:['site']
                })

        }
    }

    return (
        <div>
            <div className='body-taskForm-high'>
                <div className='body-taskForm-high-tabs'>
                    <div
                        className={`body-taskForm-high-tab ${settingType==='variable' ? 'high-tab-active' :''}`}
                        onClick={()=>changeSettingType('variable')}
                    >
                        变量
                        <span className='body-taskForm-high-num'>
                             {count?.variableNumber || 0}
                        </span>
                    </div>
                    <div
                        className={`body-taskForm-high-tab ${settingType==='message' ? 'high-tab-active' :''}`}
                        onClick={()=>changeSettingType('message')}
                    >
                        消息通知
                        <span className='body-taskForm-high-num'>
                            {count?.massageNumber || 0}
                        </span>
                    </div>
                </div>
                <PrivilegeProjectButton code={pipeline_task_update} domainId={pipeline?.id}>
                    <Button
                        title={settingType==='variable' ? "添加变量":"添加消息通知"}
                        type={"link-nopadding"}
                        onClick={addInput}
                    />
                </PrivilegeProjectButton>
            </div>
            { settingType==='variable' &&
                <Variable
                    {...props}
                    dataItem={dataItem}
                    findCount={findCount}
                    variableObj={formObj}
                    setVariableObj={setFormObj}
                />
            }
            { settingType==='message' &&
                <Message
                    {...props}
                    dataItem={dataItem}
                    findCount={findCount}
                    poseObj={formObj}
                    setPoseObj={setFormObj}
                />
            }
        </div>
    )

}

export default TaskDetailsSet;
