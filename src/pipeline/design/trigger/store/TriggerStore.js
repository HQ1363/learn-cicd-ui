import {observable,action} from "mobx";
import {Axios} from "tiklab-core-ui";
import {message} from "antd";

class TriggerStore {

    /**
     * 获取触发器
     * @param value
     * @returns {Promise<*>}
     */
    @action
    findPipelineTrigger = async value =>{
        const param = new FormData();
        param.append('pipelineId',value)
        const data = await Axios.post("/pipeline/trigger/findPipelineTrigger",param)
        return data
    }

    /**
     * 更新触发器
     * @param value
     * @returns {Promise<unknown>}
     */
    @action
    updateTrigger = async value=>{
        return await Axios.post('/pipeline/trigger/updateTrigger',value)
    }

}

const triggerStore = new TriggerStore();
export default triggerStore
