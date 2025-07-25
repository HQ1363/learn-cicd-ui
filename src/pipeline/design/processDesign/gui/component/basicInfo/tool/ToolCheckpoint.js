/**
 * @Description: 人工卡点
 * @Author: gaomengyuan
 * @Date: 2025/7/22
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/7/22
 */
import React, {useEffect, useState} from "react";
import {inject, observer} from "mobx-react";
import {Select} from "antd";
import FormsSelect from "../FormsSelect";

const ToolCheckpoint = (props) => {

    const {taskStore,pipelineStore} = props

    const {updateTask} = taskStore;
    const {findDmUserPage,pipeline} = pipelineStore;

    //流水线成员
    const [userList,setUserList] = useState([]);
    //成员当前页
    const [currentPage,setCurrentPage] = useState(1);
    //成员分页
    const [userPage,setUserPage] = useState({});

    useEffect(()=>{
        //流水线成员
        findDmUser()
    },[currentPage])

    /**
     * 流水线成员
     */
    const findDmUser = () => {
        findDmUserPage({
            pageParam:{
                pageSize: 10,
                currentPage: currentPage,
            },
            domainId:pipeline.id
        }).then(res=>{
            if(res.code===0){
                setUserPage({
                    totalRecord: res.data.totalRecord,
                    totalPage: res.data.totalPage,
                })
                if(currentPage===1){
                    setUserList(res.data.dataList)
                } else {
                    setUserList([...userList,...res.data.dataList])
                }
            }
        })
    }

    /**
     * 下拉滚动加载用户
     * @param e
     */
    const scrollEnd = (e) => {
        e.persist();
        const { target } = e;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            if (currentPage < userPage.totalPage) {
                setCurrentPage(currentPage+1)
            }
        }
    }

    /**
     * 更新
     * @param value
     * @param type
     */
    const changCheckpoint = (value,type) => {
        updateTask({[type]:value})
    }

    return (
        <>
            <FormsSelect
                name={"inspectIdList"}
                label={"验证人"}
                onChange={e=>changCheckpoint(e.join(','),'inspectIds')}
                mode="multiple"
                onPopupScroll={scrollEnd}
                rules={[
                    {required:true,message:'验证人不能为空'}
                ]}
            >
                {
                    userList && userList.map(item=>(
                        <Select.Option key={item.id} value={item.user && item.user.id}>{item.user && item.user.nickname}</Select.Option>
                    ))
                }
            </FormsSelect>
            <FormsSelect
                name={"wailTime"}
                label={"超时时间"}
                onChange={e=>changCheckpoint(e,'wailTime')}
            >
                <Select.Option value={0}>无超时时间</Select.Option>
                {
                    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map(key=>(
                        <Select.Option value={key} key={key}>{key}小时</Select.Option>
                    ))
                }
            </FormsSelect>
        </>
    )
}

export default inject("pipelineStore")(observer(ToolCheckpoint))
