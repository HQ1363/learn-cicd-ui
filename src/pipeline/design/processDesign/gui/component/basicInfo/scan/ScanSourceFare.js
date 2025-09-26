/**
 * @Description: sourceFare
 * @Author: gaomengyuan
 * @Date: 2025/5/29
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/5/29
 */
import React,{useState} from "react";
import {Select} from "antd";
import {observer} from "mobx-react";
import FormsInput from "../FormsInput";
import FormsSelect from "../FormsSelect";
import FormsTool from "../FormsTool";
import {
    toolGo,
    toolJdk,
    toolMaven,
    toolNode,
    toolSourceFareScanner
} from "../../../../../../../common/utils/Constant";
import FormsAuth from "../FormsAuth";
import sourceFareScanStore from "../../../../../../test/sourcefare/store/SourceFareScanStore";

const ScanSourceFare = props =>{

    const {taskStore} = props;

    const {updateTask, dataItem} = taskStore;
    const {findSourceFareProjectList} = sourceFareScanStore;

    const [projectList,setProjectList] = useState([]);

    const onFocus = (scanWay) => {
        const authId = dataItem.task?.authId
        if(!authId) return;
        findSourceFareProjectList({
            scanWay: scanWay,
            authId: authId
        }).then(res=>{
            if(res.code===0) {
                setProjectList(res.data)
            }
        })
    }

    /**
     * 更新sourceFare扫描数据
     */
    const changSourceFare = (value,type) =>{
        switch (type) {
            case 'scanType':
                setProjectList([]);
                updateTask({
                    scanType:value,
                    scanProjectId:'',
                    scanProjectName:''
                })
                break;
            default:
                updateTask({[type]:value})
        }
    }

    /**
     * 更新扫描项目
     * @param option
     */
    const changeProjectName = (option) => {
        updateTask({
            scanProjectId: option.value,
            scanProjectName: option.children,
        })
    }

    return (
        <>
            <FormsSelect
                name={"scanType"}
                label="扫描类型"
                onChange={value=>changSourceFare(value,'scanType')}
            >
                <Select.Option value={'server'}>服务端扫描</Select.Option>
                <Select.Option value={'client'}>客户端扫描</Select.Option>
            </FormsSelect>
            {
                dataItem?.task?.scanType === 'server' ?
                    <>
                        <FormsAuth />
                        <FormsSelect
                            rules={[{required:true, message:"扫描项目不能为空"}]}
                            name={"scanProjectName"}
                            label={"扫描项目"}
                            onFocus={()=>onFocus('server')}
                            onChange={(value,option)=>changeProjectName(option)}
                        >
                            {
                                projectList && projectList.map(({id,name})=>(
                                    <Select.Option value={id} key={id}>{name}</Select.Option>
                                ))
                            }
                        </FormsSelect>
                    </>
                    :
                    <>
                        <FormsSelect
                            name={"codeType"}
                            label="扫描代码语言"
                            onChange={value=>changSourceFare(value,'codeType')}
                        >
                            <Select.Option value={'java'}>Java</Select.Option>
                            <Select.Option value={'javascript'}>JavaScript</Select.Option>
                            <Select.Option value={'go'}>Go</Select.Option>
                        </FormsSelect>
                        {
                            dataItem?.task?.codeType === 'java' &&
                            <>
                                <FormsTool
                                    scmType={toolJdk}
                                />
                                <FormsTool
                                    scmType={toolMaven}
                                />
                            </>
                        }
                        {
                            dataItem?.task?.codeType === 'javascript' &&
                            <FormsTool
                                scmType={toolNode}
                            />
                        }
                        {
                            dataItem?.task?.codeType === 'go' &&
                            <FormsTool
                                scmType={toolGo}
                            />
                        }
                        <FormsTool
                            scmType={toolSourceFareScanner}
                        />
                        <FormsAuth />
                        <FormsSelect
                            rules={[{required:true, message:"扫描项目不能为空"}]}
                            name={"scanProjectName"}
                            label={"扫描项目"}
                            onFocus={()=>onFocus('client')}
                            onChange={(value,option)=>changeProjectName(option)}
                        >
                            {
                                projectList && projectList.map(({id,name})=>(
                                    <Select.Option value={id} key={id}>{name}</Select.Option>
                                ))
                            }
                        </FormsSelect>
                        <FormsInput
                            name={"scanPath"}
                            placeholder={"扫描代码地址"}
                            label={"扫描代码地址"}
                            isRequire={true}
                            tipText={true}
                        />
                    </>
            }
        </>
    )
}

export default observer(ScanSourceFare)
