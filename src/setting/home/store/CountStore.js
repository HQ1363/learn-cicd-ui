import {action} from "mobx";
import {Axios, getUser} from "tiklab-core-ui";


class CountStore {

    /**
     * 获取设置统计数
     */
    @action
    findPipelineCount = async value => {
        const pipelineId = new FormData();
        pipelineId.append('pipelineId',value)
        return await Axios.post('/count/findPipelineCount',pipelineId)
    }

    /**
     * 获取任务统计数
     */
    @action
    findTaskCount = async value => {
        const param = new FormData();
        param.append('pipelineId',value.pipelineId);
        param.append('taskId',value.taskId);
        return await Axios.post('/count/findTaskCount',param)
    }

    /**
     * 获取统计数
     */
    @action
    findCount = async () => {
        return await Axios.post('/count/findCount')
    }

    /**
     * 查询产品状态
     * @returns {Promise<unknown>}
     */
    findHomesApplyProduct= async () =>{
        return await Axios.post('/home/product/findApplyProduct', {
            type: 'cloud',
            versionType: 'server',
            tenantId: getUser().tenant,
            code:'arbess',
        })
    }

    /**
     * 查询产品状态
     * @returns {Promise<unknown>}
     */
    findUseLicence= async () =>{
        return await Axios.post('/licence/findUseLicence')
    }

}


export default new CountStore()
