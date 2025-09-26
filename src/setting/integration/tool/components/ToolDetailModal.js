/**
 * @Description: 工具添加编辑弹出框
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React, {useEffect, useRef, useState} from "react";
import {Form, Input, Progress, Select, Upload} from "antd";
import {copyText, Validation} from "../../../../common/utils/Client";
import Modals from "../../../../common/component/modal/Modal";
import toolStore from "../store/ToolStore";
import {scmPlaceholder, scmTitle} from "./ToolCommon";
import {getUser} from "tiklab-core-ui";
import Button from "../../../../common/component/button/Button";
import {getAPIgateway} from "tiklab-core-ui";
import ToolDetailModalOnline from "./ToolDetailModalOnline";
import homesStore from "../store/HomesStore";
import {CheckCircleOutlined, CloseCircleOutlined, CopyOutlined, DeleteOutlined} from "@ant-design/icons";

const ToolDetailModal = props =>{

    const {visible,setVisible,formValue,findAllScm,scmType='jdk',isConfig} = props;

    const {updatePipelineScm,findScmRemoteFile} = toolStore;

    const user = getUser();
    const intervalRef = useRef(null);
    const [form] = Form.useForm();

    //本地上传二进制包
    const [fileList, setFileList] = useState([]);
    //在线安装弹出框
    const [onlineVisible,setOnlineVisible] = useState(false);
    //下载时数据
    const [downloadData,setDownloadData] = useState(null);
    //下载时加载
    const [downloading,setDownLoading] = useState(false);
    //选中的安装包
    const [selectedRow,setSelectedRow] = useState(null);
    //是否是源码
    const code = ['git','svn'].includes(scmType);

    useEffect(()=>{
        if(visible && formValue){
            form.setFieldsValue(formValue)
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

    const status = code ? ['2','3','5','6'] : ['3','5','6'];

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
                    if(code){
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
            setDownloadData(null)
        }
    }


    const uploadUrl = base_url === '/' ? window.location.origin : base_url;

    /**
     * 表单字段更新
     * @param value
     */
    const onValuesChange = (value) => {
        if(value.addType){
            switch (value.addType) {
                case 'local':
                    form.setFieldsValue({
                        scmAddress: null
                    })
                    break
                case 'pkg':
                    form.setFieldsValue({
                        scmAddress: null,
                        pkg: []
                    })
                    break
                case 'online':
                    form.setFieldsValue({
                        scmAddress: null,
                        pkg: null
                    })
                    break
            }
            setFileList([])
        }
    }

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


    const UploadPkg = (
        <>
            <Form.Item
                label={"二进制包"}
                name="pkg"
                valuePropName="fileList"
                getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
                rules={[
                    { required: true, message: `请上传二进制包` },
                    {
                        validator: (_, files) => {
                            // 检查是否有上传失败的文件
                            if (files?.some(f => f.status === 'error')) {
                                return Promise.reject('存在上传失败的文件');
                            }
                            if(files.length > 0 && files[0]?.status === 'done'){
                                const response = files[0].response;
                                if(response.code!==0){
                                    return Promise.reject(response.msg);
                                }
                            }
                            return Promise.resolve();
                        }
                    }
                ]}
            >
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
                    {fileList.length < 1 && <Button>上传</Button>}
                </Upload>
            </Form.Item>
            {
                fileList.length > 0 && fileList[0]?.response?.code === 0 &&
                ScmAddressInput(true)
            }
        </>
    )

    const OnlineDownloadPath = (
        <>
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
        </>
    )

    const OnlineDownload = (
        <>
            <Form.Item
                label="版本"
                name="pkg"
                rules={[
                    {required:true,message:'请选择版本'},
                    {
                        validator: (_, value) => {
                            if(value){
                                switch (value) {
                                    case '2':
                                        if (code){
                                            return Promise.resolve()
                                        }
                                        return Promise.reject('正在下载中，请稍后…')
                                    case '3':
                                        return Promise.reject('下载失败')
                                    case '4':
                                        return Promise.reject('正在解压文件，请稍后…')
                                    case '5':
                                        return Promise.resolve()
                                    case '6':
                                        return Promise.reject('解压失败')
                                    default:
                                        return Promise.reject('正在下载中，请稍后…')
                                }
                            }
                            return Promise.resolve()
                        },
                    },
                ]}
            >
                {downloadData ? (
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
                                onClick={() =>{
                                    form.setFieldsValue({pkg:null})
                                    setDownloadData(null)
                                }}
                            >
                                <DeleteOutlined />
                            </div>
                        )}
                    </div>
                ) : (
                    <Button onClick={() => setOnlineVisible(true)}>选择版本</Button>
                )}
            </Form.Item>
            {
                code ?
                    (downloadData?.status==='2' && OnlineDownloadPath)
                    :
                    (downloadData?.binPath && ScmAddressInput(true))
            }
        </>
    )

    return (
        <>
            <Modals
                visible={visible}
                title={ formValue ? "修改":"添加"}
                className={'tool-modal'}
                onCancel={onCancel}
                onOk={onOk}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="userForm"
                    autoComplete="off"
                    initialValues={{addType:'local'}}
                    onValuesChange={onValuesChange}
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
                    <Form.Item label={'安装方式'} name={'addType'}>
                        <Select disabled={!!formValue}>
                            <Select.Option value={'local'}>本地安装</Select.Option>
                            <Select.Option value={'pkg'}>安装包</Select.Option>
                            <Select.Option value={'online'}>在线安装</Select.Option>
                        </Select>
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
                                    return UploadPkg
                                case 'local':
                                    return ScmAddressInput(false)
                                case 'online':
                                    if(formValue) {
                                        return ScmAddressInput(true)
                                    }
                                    return OnlineDownload
                                default:
                                    return null
                            }
                        }}
                    </Form.Item>
                </Form>
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
