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
    toolCAdd,
    toolGo,
    toolJdk,
    toolMaven, toolNetCore,
    toolNode, toolPython,
    toolSourceFareScanner
} from "../../../../../../../common/utils/Constant";
import FormsAuth from "../FormsAuth";
import sourceFareScanStore from "../../../../../../test/sourcefare/store/SourceFareScanStore";

const ScanSourceFare = props =>{

    const {taskStore} = props;

    const {updateTask, dataItem} = taskStore;
    const {findSourceFareProjectList} = sourceFareScanStore;

    //扫描项目
    const [projectList,setProjectList] = useState([]);

    /**
     * 获取扫描项目
     * @param scanWay
     */
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

    //扫描代码语言所需工具
    const codeTypeTools = {
        java: [toolJdk, toolMaven],
        javascript: [toolNode],
        go: [toolGo],
        python: [toolPython],
        c3: [toolNetCore],
        'c-cadd': [toolCAdd]
    };

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
                            label={"项目Key"}
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
                        <div className='taskForm-forms-config-title'>SourceFare scanner配置</div>
                        <FormsTool
                            scmType={toolSourceFareScanner}
                        />
                        <FormsSelect
                            name={"codeType"}
                            label="扫描代码语言"
                            onChange={value=>changSourceFare(value,'codeType')}
                        >
                            <Select.Option value={'java'}>Java</Select.Option>
                            <Select.Option value={'javascript'}>JavaScript</Select.Option>
                            <Select.Option value={'go'}>Go</Select.Option>
                            <Select.Option value={'python'}>Python</Select.Option>
                            <Select.Option value={'c3'}>c#</Select.Option>
                            <Select.Option value={'c-cadd'}>c/c++</Select.Option>
                        </FormsSelect>
                        {
                            dataItem?.task?.codeType && codeTypeTools[dataItem.task.codeType]?.map((tool, index) => (
                                <FormsTool key={index} scmType={tool} />
                            ))
                        }
                        <FormsInput
                            name={"scanPath"}
                            placeholder={"扫描代码地址"}
                            label={"扫描代码地址"}
                            isRequire={true}
                            tipText={true}
                        />
                        {
                            ['java','go'].includes(dataItem?.task?.codeType) &&
                            <FormsSelect
                                name={"scanCoverage"}
                                label="是否开启覆盖率扫描"
                                onChange={value=>changSourceFare(value,'scanCoverage')}
                            >
                                <Select.Option value={0}>关闭</Select.Option>
                                <Select.Option value={1}>开启</Select.Option>
                            </FormsSelect>
                        }
                        <div className='taskForm-forms-config-title'>SourceFare server配置</div>
                        <FormsAuth />
                        <FormsSelect
                            rules={[{required:true, message:"扫描项目不能为空"}]}
                            name={"scanProjectName"}
                            label={"项目Key"}
                            onFocus={()=>onFocus('client')}
                            onChange={(value,option)=>changeProjectName(option)}
                        >
                            {
                                projectList && projectList.map(({id,name})=>(
                                    <Select.Option value={id} key={id}>{name}</Select.Option>
                                ))
                            }
                        </FormsSelect>
                    </>
            }
        </>
    )
}

export default observer(ScanSourceFare)
