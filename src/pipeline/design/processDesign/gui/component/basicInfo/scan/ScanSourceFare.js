/**
 * @Description: sourceFare
 * @Author: gaomengyuan
 * @Date: 2025/5/29
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/5/29
 */
import React from "react";
import {Select} from "antd";
import {observer} from "mobx-react";
import FormsInput from "../FormsInput";
import FormsSelect from "../FormsSelect";
import FormsTool from "../FormsTool";
import {toolGo, toolJdk, toolMaven, toolNode, toolSourceFareScanner} from "../../../../../../../common/utils/Constant";
import FormsAuth from "../FormsAuth";

const ScanSourceFare = props =>{

    const {taskStore} = props;

    const {updateTask, dataItem} = taskStore;

    /**
     * 更新sourceFare扫描数据
     */
    const changSourceFare = (value,type) =>{
        updateTask({[type]:value})
    }

    return (
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
            <FormsAuth />
            <FormsTool
                scmType={toolSourceFareScanner}
            />
            <FormsInput
                name={"projectName"}
                placeholder={"项目ID"}
                label={"项目ID"}
                isRequire={true}
            />
            <FormsInput
                name={"scanPath"}
                placeholder={"扫描代码地址"}
                label={"扫描代码地址"}
                isRequire={true}
            />
        </>
    )
}

export default observer(ScanSourceFare)
