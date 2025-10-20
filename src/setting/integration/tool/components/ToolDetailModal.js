/**
 * @Description: 工具添加编辑弹出框
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React, {useEffect, useRef, useState} from "react";
import {Form, Input, Upload, message, Spin, Space} from "antd";
import {copyText, Validation} from "../../../../common/utils/Client";
import Modals from "../../../../common/component/modal/Modal";
import toolStore from "../store/ToolStore";
import {scmPlaceholder, scmTitle} from "./ToolCommon";
import {
    toolJdk,
    toolCAdd,
    toolGit,
    toolNetCore,
    toolPhp,
    toolPython,
    toolSonarScanner,
    toolSourceFareScanner,
    toolSvn
} from "../../../../common/utils/Constant";
import {getUser} from "tiklab-core-ui";
import Button from "../../../../common/component/button/Button";
import {getAPIgateway} from "tiklab-core-ui";
import ToolDetailModalOnline from "./ToolDetailModalOnline";
import {CopyOutlined, DeleteOutlined} from "@ant-design/icons";
import "./ToolDetailModal.scss";

const ToolDetailModal = props =>{

    const {visible,setVisible,formValue,findAllScm,scmType=toolJdk,isConfig} = props;

    const {updatePipelineScm,findScmRemoteFile,findEnvInfo} = toolStore;

    const user = getUser();
    const intervalRef = useRef(null);
    const [form] = Form.useForm();

    //本地上传二进制包
    const [fileList, setFileList] = useState([]);
    //在线安装弹出框
    const [onlineVisible,setOnlineVisible] = useState(false);
    //在线安装数据
    const [downloadData,setDownloadData] = useState(null);
    //在线安装加载
    const [downloading,setDownLoading] = useState(false);
    //选中的安装包
    const [selectedRow,setSelectedRow] = useState(null);
    //全局安装数据
    const [globalFile,setGlobalFile] = useState(null);
    //全局安装加载
    const [globalLoading,setGlobalLoading] = useState(false);
    //是否是源码
    const isCodeTool = [toolGit,toolSvn].includes(scmType);
    //特殊构建工具
    const isSpecialTool = [toolPython,toolPhp,toolNetCore,toolCAdd].includes(scmType);
    //没有全局安装
    const noGlobalTool = [toolSonarScanner,toolSourceFareScanner].includes(scmType);
    //安装方式
    const addTypeList = [
        { id: 'global', title: '全局安装', desc:`系统已安装全局${scmTitle[scmType]}` },
        { id: 'local', title: '指定路径安装', desc:`系统存在${scmTitle[scmType]}，但没有配置全局命令` },
        { id: 'pkg', title: '安装包安装', desc:`直接上传或在线下载${scmTitle[scmType]}的二进制包安装` },
    ]

    useEffect(()=>{
        if(visible && formValue){
            if(isSpecialTool){
                form.setFieldsValue({
                    ...formValue,
                    pkg: formValue.scmAddress,
                })
                setGlobalFile({
                    path: formValue.scmAddress,
                })
            } else {
                form.setFieldsValue({
                    ...formValue,
                    addType: formValue.addType === 'online' ? 'pkg' : formValue.addType
                });
            }
        }
    },[visible])


    const statusTitle = {
        '0': '准备下载',
        '1': '下载中…',
        '2': '下载完成',
        '3': '下载失败',
        '4': '解压文件…',
        '5': '完成',
        '6': '解压失败',
    }

    const status = isCodeTool ? ['2','3','5','6'] : ['3','5','6'];

    /**
     * 下载安装包
     */
    const findRemoteFile = id =>{
        setDownLoading(true);
        findScmRemoteFile(id).then(fileRes=>{
            if(fileRes.data){
                const data = fileRes.data;
                setDownloadData(data);
                if(['0','1'].includes(data.status)){
                    findInter(id)
                }
            }
        }).catch(()=>{
            setDownLoading(false);
        })
    }

    /**
     * 开启定时器
     */
    const findInter = id =>{
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(()=>{
            findScmRemoteFile(id).then(fileRes=>{
                if(fileRes.data){
                    const data = fileRes.data;
                    setDownloadData(data);
                    if(status.includes(data.status)){
                        clearInterval(intervalRef.current);
                        setDownLoading(false)
                    }
                    if(isCodeTool){
                        form.setFieldsValue({
                            pkg: data?.status,
                            localPath: data?.localPath,
                        })
                    } else {
                        form.setFieldsValue({
                            pkg: data?.status,
                            scmAddress: data?.binPath,
                        })
                    }
                } else {
                    clearInterval(intervalRef.current);
                    setDownLoading(false)
                }
            }).catch(()=>{
                clearInterval(intervalRef.current);
                setDownLoading(false)
            })
        },1000)
    }

    /**
     * 全局安装检测
     */
    const findGlobalFile = () => {
        if(globalLoading) return;
        setGlobalLoading(true);
        findEnvInfo(scmType).then(res=>{
            if(res.code===0){
                const data = res.data;
                if(data.installed){
                    message.success('检测成功');
                    setGlobalFile(res.data);
                    form.setFieldsValue({
                        pkg: data?.path,
                        scmAddress: data?.path,
                    })
                } else {
                    message.info(`没有检测当前系统安装${scmTitle[scmType]}`)
                }
            } else {
                message.info(res.msg)
            }
        }).finally(()=>{
            setGlobalLoading(false);
        })
    }

    /**
     * 更新或添加确定
     */
    const onOk = () =>{
        form.validateFields().then((values) => {
            const {addType,scmName,scmAddress} = values;
            const params = {
                scmType: scmType,
                addType: addType,
                scmName: scmName,
                scmAddress: scmAddress,
            }
            if(formValue?.scmId){
                params.scmId = formValue.scmId;
            }
            updatePipelineScm(params).then(res=>{
                if(res.code===0){
                    findAllScm()
                    onCancel()
                }
            })
        })
    }

    /**
     * 关闭弹出框
     */
    const onCancel = () => {
        if(!downloading){
            form.resetFields();
            setVisible(false);
            setFileList([]);
            setDownloadData(null);
            setGlobalFile(null);
        }
    }

    /**
     * 安装方式更新
     * @param value
     */
    const onAddTypeChange = (value) => {
        if(formValue) return;
        // 设置 addType 字段值
        form.setFieldsValue({ addType: value });
        // 根据不同类型设置对应的表单值
        const fieldValues = {
            local: { scmAddress: null },
            global: { scmAddress: null, pkg: null },
            pkg: { scmAddress: null, pkg: null },
        };
        // 使用可选链操作符和空值合并，避免重复设置
        const valuesToSet = fieldValues[value];
        if (valuesToSet) {
            form.setFieldsValue(valuesToSet);
        }
        setFileList([]);
        setGlobalFile(null);
        setDownloadData(null);
    }

    //安装路径
    const ScmAddressInput = (disabled) => (
        <Form.Item
            label={`${scmTitle[scmType]}安装路径`}
            name="scmAddress"
            rules={[
                { required: true, message: `请输入${scmTitle[scmType]}安装路径` },
                Validation(`${scmTitle[scmType]}安装路径`)
            ]}
        >
            <Input placeholder={scmPlaceholder[scmType]} disabled={disabled} />
        </Form.Item>
    );

    //全局安装
    const globalDownload = (
        <>
            <Form.Item
                label={'检测安装路径'}
                name={'pkg'}
                rules={[
                    {required:true,message:'请先检测安装路径'},
                ]}
            >
                <Button onClick={findGlobalFile}>
                    {globalFile ? '重新检测' : '检测'}
                </Button>
            </Form.Item>
            {globalFile?.path && ScmAddressInput(true)}
        </>
    )

    //上传地址
    const uploadUrl = base_url === '/' ? window.location.origin : base_url;

    const validatePkg = (_, value) => {
        if(value){
            // 选择版本校验
            if (typeof value === 'string') {
                switch (value) {
                    case '2': return isCodeTool ? Promise.resolve() : Promise.reject('正在下载中，请稍后…');
                    case '3': return Promise.reject('下载失败');
                    case '4': return Promise.reject('正在解压文件，请稍后…');
                    case '5': return Promise.resolve();
                    case '6': return Promise.reject('解压失败');
                    default: return Promise.reject('正在下载中，请稍后…');
                }
            }
            // 上传安装包效验
            if(value?.length > 0){
                const file = value[0];
                if (file.status === 'error'){
                    return Promise.reject('存在上传失败的文件');
                }
                if (file.status === 'uploading') {
                    return Promise.reject('正在上传中，请稍后…');
                }
                if (file.status === 'done') {
                    const response = file.response;
                    if(response.code!==0){
                        return Promise.reject(response.msg);
                    }
                }
            }
        }
        return Promise.resolve();
    };

    //安装包安装
    const pkgDownload = (
        <>
            <Form.Item
                label="安装类型"
                name="pkg"
                rules={[
                    { required: true, message: '请选择在线下载或上传二安装包' },
                    { validator: validatePkg },
                ]}
            >
                {
                    downloadData ?
                        <div className="tool-online-download">
                            <div className="online-download-version">
                                {selectedRow.systemType}-{selectedRow.version}-{selectedRow.systemVersion}
                            </div>
                            <div className={["3", "6"].includes(downloadData.status) ? "online-download-red" : "online-download-blue"}>
                                {downloadData.downloadSize} / {statusTitle[downloadData.status]}
                            </div>
                            {status.includes(downloadData.status) && (
                                <div
                                    className="online-download-delete"
                                    onClick={() => {
                                        form.setFieldsValue({ pkg: null });
                                        setDownloadData(null);
                                    }}
                                >
                                    <DeleteOutlined />
                                </div>
                            )}
                        </div>
                        :
                        <div>
                            {
                                fileList.length < 1 &&
                                <>
                                    <Button
                                        onClick={()=>setOnlineVisible(true)}
                                    >
                                        在线下载
                                    </Button>
                                    <span className='tool-download-or'>
                                        或
                                    </span>
                                </>
                            }
                            <Upload
                                action={uploadUrl + '/scm/file/upload'}
                                name={"uploadFile"}
                                headers={{
                                    ticket: user.ticket,
                                    tenant: user.tenant,
                                    ...getAPIgateway(),
                                }}
                                accept={'.gz,.zip,.tgz'}
                                maxCount={1}
                                fileList={fileList}
                                onChange={({ fileList }) => {
                                    setFileList(fileList);
                                    form.setFieldsValue({ pkg: fileList });
                                    if(fileList.length > 0 && fileList[0]?.status === 'done'){
                                        const response = fileList[0].response;
                                        if(response.code===0){
                                            form.setFieldsValue({
                                                scmAddress: response?.data
                                            })
                                        }
                                    }
                                }}
                            >
                                {fileList.length < 1 && <Button>上传安装包</Button>}
                            </Upload>
                        </div>
                }
            </Form.Item>
            {
                fileList.length > 0 && fileList[0]?.response?.code === 0 &&
                ScmAddressInput(true)
            }
            {
                isCodeTool ?
                    (downloadData?.status==='2' && <>
                        <Form.Item
                            label={`${scmTitle[scmType]}下载位置`}
                            name="localPath"
                            rules={[
                                { required: true, message: `请输入${scmTitle[scmType]}下载位置` },
                                Validation(`${scmTitle[scmType]}下载位置`)
                            ]}
                            extra={`提示：${scmTitle[scmType]}不支持直接安装，需要手动安装后输入安装路径。`}
                        >
                            <Input
                                placeholder={`${scmTitle[scmType]}下载位置`}
                                readOnly
                                suffix={<CopyOutlined style={{ cursor: 'pointer' }} onClick={() => copyText(downloadData?.localPath)} />}
                            />
                        </Form.Item>
                        {ScmAddressInput(false)}
                    </>)
                    :
                    (downloadData?.binPath && ScmAddressInput(true))
            }
        </>

    )

    return (
        <>
            <Modals
                visible={visible}
                title={formValue ? "修改":"添加"}
                className={'tool-modal'}
                onCancel={onCancel}
                onOk={onOk}
                width={580}
            >
                <Spin spinning={globalLoading}>
                    <Form
                        form={form}
                        layout="vertical"
                        name="userForm"
                        autoComplete="off"
                        initialValues={{addType: isSpecialTool ? 'global' : 'pkg'}}
                    >
                        <Form.Item
                            label={`名称`}
                            name="scmName"
                            rules={[
                                {required:true,message:`请输入名称`},
                                Validation(`名称`)
                            ]}
                        >
                            <Input placeholder={`名称`}/>
                        </Form.Item>
                        <Form.Item name="addType"  noStyle>
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item label="安装方式" shouldUpdate>
                            {() => {
                                const value = form.getFieldValue('addType');
                                return (
                                    <div className="tool-download-addType">
                                        {addTypeList.map(({ id, title,desc }) =>{
                                            if(noGlobalTool && id==='global') return ;
                                            if(isSpecialTool && id!=='global') return ;
                                            const classNames = [
                                                'download-addType-item',
                                                !!formValue ? 'download-addType-ban' : 'download-addType-allow',
                                                value === id ? 'download-addType-active' : '',
                                            ].join(' ');
                                            return (
                                                <div
                                                    key={id}
                                                    onClick={() => onAddTypeChange(id)}
                                                    className={classNames}
                                                >
                                                    <div className='download-addType-item-title'>{title}</div>
                                                    <div className='download-addType-item-desc'>{desc}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                );
                            }}
                        </Form.Item>
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) => prevValues.addType !== currentValues.addType}
                        >
                            {({ getFieldValue }) => {
                                const addType = getFieldValue('addType');
                                switch (addType) {
                                    case 'pkg':
                                        if(formValue) {
                                            return ScmAddressInput(true)
                                        }
                                        return pkgDownload
                                    case 'local':
                                        return ScmAddressInput(false)
                                    case 'global':
                                        return globalDownload;
                                    default:
                                        return null
                                }
                            }}
                        </Form.Item>
                    </Form>
                </Spin>
            </Modals>
            <ToolDetailModalOnline
                scmType={scmType}
                onlineVisible={onlineVisible}
                setOnlineVisible={setOnlineVisible}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
                findRemoteFile={findRemoteFile}
            />
        </>
    )
}

export default ToolDetailModal
