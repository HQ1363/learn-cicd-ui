/**
 * @Description: 工具添加编辑弹出框
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React, {useEffect, useMemo, useState} from "react";
import {message, Radio, Spin, Table} from "antd";
import Modals from "../../../../common/component/modal/Modal";
import toolStore from "../store/ToolStore";
import {scmTitle} from "./ToolCommon";
import homesStore from "../store/HomesStore";
import ListEmpty from "../../../../common/component/list/ListEmpty";
import {toolGit,toolSvn,toolJdk} from "../../../../common/utils/Constant";

const ToolDetailModalOnline = props =>{

    const {onlineVisible,setOnlineVisible,selectedRow,setSelectedRow,findRemoteFile,scmType} = props;

    const {downloadFile,downloadAndInstall} = toolStore;
    const {findToolsType,findToolsVersionList} = homesStore;

    //在线安装包数据
    const [onlineData,setOnlineData] = useState([]);
    //在线安装包加载
    const [onlineLoading,setOnlineLoading] = useState(false);

    useEffect(() => {
        if(onlineVisible){
            findToolsType({
                type: scmType===toolJdk ? "openjdk" : scmType
            }).then(res=>{
                if(res.data.length > 0){
                    const data = res.data[0];
                    setOnlineLoading(true)
                    findToolsVersionList({
                        toolsTypeId: data.id
                    }).then(versionRes=>{
                        if(versionRes.code===0){
                            setOnlineData(versionRes.data)
                        }
                    }).finally(()=>{
                        setOnlineLoading(false)
                    })
                }
            })
        }
    }, [onlineVisible]);

    /**
     * 下载在线安装包
     */
    const onlineOk = async () => {
        if(!selectedRow){
            message.info('请先选择安装包');
        }
        const { id, fileAddress, systemType, fileName } = selectedRow;
        const values ={
            downloadUrl:`${fileAddress}/${systemType}`,
            fileName: fileName,
            id: id
        }
        let res;
        if([toolGit,toolSvn].includes(scmType)){
            res = await downloadFile(values)
        } else {
            res = await downloadAndInstall(values)
        }
        if (res?.code === 0) {
            findRemoteFile(id);
            onlineCancel();
        } else {
            message.error(res?.msg || "下载失败");
        }
    };

    /**
     * 关闭下载安装包
     */
    const onlineCancel = () => {
        setOnlineVisible(false);
    }

    const { flatData, versionRowSpanMap } = useMemo(() => {
        const rowSpanMap = {};
        const flattened = [];
        (onlineData || []).forEach(item => {
            rowSpanMap[item.id] = item.children.length;
            item.children.forEach((child, i) => {
                flattened.push({
                    ...child,
                    version: item.version,
                    versionId: item.id,
                    childrenVersionRow: i,
                });
            });
        });
        return { flatData: flattened, versionRowSpanMap: rowSpanMap };
    }, [onlineData]);


    const columns = [
        {
            title: '版本',
            dataIndex: 'version',
            width:"25%",
            ellipsis:true,
            render: (text, record, index) => {
                // 找到父行第一次出现的子行显示版本
                if (record.childrenVersionRow === 0) {
                    return {
                        children: <strong>{record.version}</strong>,
                        props: { rowSpan: versionRowSpanMap[record.versionId] },
                    };
                }
                // 其他子行版本列隐藏
                return { children: null, props: { rowSpan: 0 } };
            },
        },
        {
            title: '系统类型',
            dataIndex: 'systemType',
            width:"30%",
            ellipsis:true,
            render: (text,record) => `${text}（${record.systemVersion}）`
        },
        {
            title: '大小',
            dataIndex: 'fileSize',
            width:"30%",
            ellipsis:true,
        },
        {
            title: '操作',
            dataIndex: 'action',
            width:"15%",
            ellipsis:true,
            render: (text,record) => {
                return (
                    <Radio
                        value={record.id}
                        onChange={() => setSelectedRow(record)}
                    />
                )
            },
        },
    ];

    return (
        <Modals
            visible={onlineVisible}
            title={`下载${scmTitle[scmType]}安装包`}
            width={800}
            onCancel={onlineCancel}
            onOk={onlineOk}
            className='tool-online-modal'
        >
            <Spin spinning={onlineLoading}>
                <Radio.Group value={selectedRow?.id}>
                    <Table
                        dataSource={flatData}
                        columns={columns}
                        rowKey={record => record.id}
                        pagination={false}
                        bordered={true}
                        locale={{emptyText: <ListEmpty />}}
                    />
                </Radio.Group>
            </Spin>
        </Modals>
    )
}

export default ToolDetailModalOnline
