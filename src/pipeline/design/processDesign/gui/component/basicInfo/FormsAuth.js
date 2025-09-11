/**
 * @Description: 任务认证配置
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/11
 */
import React,{useState,useEffect} from "react";
import {inject,observer} from "mobx-react";
import {Select, Divider} from "antd";
import ServerDetailAddBtn from "../../../../../../setting/integration/server/components/ServerDetailAddBtn";
import HostAddBtn from "../../../../../../setting/configure/host/component/HostAddBtn";
import K8sAddBtn from "../../../../../../setting/configure/k8s/components/K8sAddBtn";
import hostStore from "../../../../../../setting/configure/host/store/HostStore";
import hostGroupStore from "../../../../../../setting/configure/host/store/HostGroupStore";
import serverStore from "../../../../../../setting/integration/server/store/ServerStore";
import k8sStore from "../../../../../../setting/configure/k8s/store/K8sStore";
import FormsSelect from "./FormsSelect";
import {
    docker,
    gitee,
    github,
    gitlab,
    gitpuk,
    k8s,
    liunx,
    pri_gitlab,
    sonar,
    testhubo,
    upload_ssh,
    upload_hadess,
    upload_nexus,
    download_hadess,
    download_ssh,
    download_nexus,
    sourcefare,
    host_order,
    code_gitea, test_postin,
} from "../../../../../../common/utils/Constant";
import {taskTitle} from "../TaskCommon";
import {maskString} from "../../../../../../common/utils/Client";

const FormsAuth = props =>{

    const {taskStore}=props;

    const {findAuthServerList} = serverStore;
    const {findAuthHostList} = hostStore;
    const {findHostGroupList} = hostGroupStore;
    const {findKubectlList} = k8sStore;
    const {updateTask, dataItem: {taskType = ''} = {}} = taskStore;

    //弹出框
    const [visible,setVisible] = useState(false);
    //选择框列表
    const [list,setList] = useState([]);
    //选择框visible
    const [open,setOpen] = useState(false);

    useEffect(()=>{
        //获取服务列表
        findAuth()
    },[])

    /**
     * 获取选择框list
     */
    const findAuth = () =>{
        switch (taskType) {
            case liunx:
            case host_order:
                findAllHost()
                break
            case upload_ssh:
            case download_ssh:
            case docker:
                findHost()
                break
            case k8s:
                findK8sHost()
                break
            case gitee:
            case github:
            case gitlab:
            case pri_gitlab:
            case gitpuk:
            case sonar:
            case sourcefare:
                finsServer(taskType)
                break
            case testhubo:
            case test_postin:
                finsServer('postin')
                break
            case code_gitea:
                finsServer('gitea')
                break
            case upload_hadess:
            case download_hadess:
                finsServer('hadess')
                break
            case upload_nexus:
            case download_nexus:
                finsServer('nexus')
        }
    }

    /**
     * 获取主机和主机组
     */
    const findAllHost = async () => {
        const hostGroupRes = await findHostGroupList();
        const hostRes = await findAuthHostList({});
        Promise.all([hostGroupRes,hostRes]).then(res=>{
            const filterRes = res.filter(item=>item.code ===0).map(li => li.data).flat();
            setList(filterRes)
        })
    }

    /**
     * 获取主机
     */
    const findHost = () => {
        findAuthHostList({}).then(res=>{
            if(res.code===0){
                setList(res.data)
            }
        })
    }

    /**
     * 获取K8s
     */
    const findK8sHost = () => {
        findKubectlList({}).then(res=>{
            if(res.code===0){
                setList(res.data)
            }
        })
    }

    /**
     * 获取服务地址
     * @param serverType
     */
    const finsServer = (serverType) => {
        findAuthServerList({type:serverType}).then(res=>{
            if(res.code===0){
                setList(res.data)
            }
        })
    }

    /**
     * 改变凭证
     * @param value
     */
    const changeAuthSelect = value =>{
        updateTask({authId:value})
    }

    /**
     * 认证标题
     */
    const label = () => {
        const title = taskTitle(taskType);
        switch (taskType) {
            case gitee:
            case github:
            case gitlab:
            case pri_gitlab:
            case code_gitea:
                return `${title}授权信息`
            case gitpuk:
            case sonar:
            case sourcefare:
                return `${title}服务`
            case testhubo:
            case test_postin:
                return 'PostIn服务'
            case liunx:
            case docker:
            case host_order:
                return "主机地址"
            case k8s:
                return "集群地址"
            case upload_hadess:
            case download_hadess:
                return 'Hadess服务'
            case upload_ssh:
            case upload_nexus:
                return "上传地址"
            case download_ssh:
            case download_nexus:
                return '下载地址'
        }
    }

    /**
     * 选择框 value
     * @param item
     * @returns {number}
     */
    const setKey = item =>{
        switch (taskType) {
            case gitee:
            case github:
            case gitlab:
            case pri_gitlab:
            case gitpuk:
            case testhubo:
            case test_postin:
            case sonar:
            case sourcefare:
            case upload_hadess:
            case upload_nexus:
            case download_hadess:
            case download_nexus:
            case code_gitea:
                return item.serverId
            case liunx:
            case host_order:
                return item?.groupId ? item.groupId : item.hostId
            case upload_ssh:
            case download_ssh:
            case docker:
                return item.hostId
            case k8s:
                return item.id
        }
    }

    /**
     * 选择框按钮
     */
    const renderBtn = () =>{
        const commonProps = {
            isConfig: true,
            visible: visible,
            setVisible: setVisible,
            findAuth: findAuth
        };
        switch (taskType) {
            case liunx:
            case docker:
            case upload_ssh:
            case download_ssh:
            case host_order:
                return <HostAddBtn {...commonProps}/>
            case k8s:
                return <K8sAddBtn {...commonProps}/>
            case gitee:
            case github:
            case gitlab:
            case pri_gitlab:
            case sonar:
                return <ServerDetailAddBtn type={taskType} {...commonProps}/>;
            case code_gitea:
                return <ServerDetailAddBtn type={'gitea'} {...commonProps}/>;
            case gitpuk:
            case sourcefare:
                return version === 'cloud' ? null : <ServerDetailAddBtn type={taskType} {...commonProps}/>;
            case testhubo:
            case test_postin:
                return version === 'cloud' ? null : <ServerDetailAddBtn type={'postin'} {...commonProps}/>;
            case upload_hadess:
            case download_hadess:
                return version === 'cloud' ? null : <ServerDetailAddBtn type={'hadess'} {...commonProps}/>
            case upload_nexus:
            case download_nexus:
                return version === 'cloud' ? null : <ServerDetailAddBtn type={'nexus'} {...commonProps}/>
            default: return null
        }
    }


    /**
     * 选择框label
     */
    const selectLabel = item => {
        switch (taskType) {
            case gitpuk:
            case testhubo:
            case test_postin:
            case sonar:
            case sourcefare:
            case upload_hadess:
            case upload_nexus:
            case download_hadess:
            case download_nexus:
                return `${item.name}(${item.serverAddress})`;
            case gitee:
            case gitlab:
            case pri_gitlab:
            case github:
            case code_gitea:
                return `${item.name}(${maskString(item.accessToken)})`;
            case upload_ssh:
            case download_ssh:
            case docker:
                return `${item.name}(${item.ip})`
            case liunx:
            case host_order:
                return item.groupName ? `${item.groupName}(主机组)` : `${item.name}(${item.ip})`;
            case k8s:
                return `${item.name}(${item.k8sVersion?.serverAddress || '-'})`
            default:
                return '';
        }
    };


    /**
     * 效验
     */
    const rules = () => {
        let rule = [{required:false}];
        switch (taskType) {
            case upload_ssh:
            case upload_hadess:
            case upload_nexus:
            case download_hadess:
            case download_ssh:
            case download_nexus:
            case liunx:
            case docker:
            case k8s:
            case testhubo:
            case test_postin:
            case sonar:
            case gitee:
            case github:
            case gitlab:
            case pri_gitlab:
            case gitpuk:
            case sourcefare:
            case host_order:
            case code_gitea:
                rule = [{required:true,message:`${label()}不能为空`}];
                break;
            default:
                break;
        }
        return rule;
    }

    return(
        <FormsSelect
            name={"authId"}
            label={label()}
            rules={rules()}
            placeholder={`请选择${label()}`}
            open={open}
            isSpin={false}
            onChange={changeAuthSelect}
            onDropdownVisibleChange={(visible)=>setOpen(visible)}
            dropdownRender={menu=> (
                <>
                    {menu}
                    <Divider style={{margin:"4px 0"}} />
                    <div style={{cursor:"pointer"}} onClick={()=>setOpen(false)}>
                        {renderBtn()}
                    </div>
                </>
            )}
        >
            {list && list.map((item,index)=>{
                return <Select.Option value={setKey(item)} key={index}>{selectLabel(item)}</Select.Option>
            })}
        </FormsSelect>
    )
}

export default inject("taskStore")(observer(FormsAuth))
