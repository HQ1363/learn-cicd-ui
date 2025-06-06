import {action, observable} from "mobx";
import {Axios} from "tiklab-core-ui";
import {message} from "antd";

class PipelineMessageStore {

    //未配置的消息发送方式
    @observable
    mesSendData = []

    /**
     * 获取未配置的消息发送方式
     * @param value
     * @returns {Promise<*>}
     */
    @action
    findMessageSendType = async value =>{
        const data = await Axios.post("/pipeline/message/findMessageSendTypeList")
        if(data.code===0){
            this.mesSendData=data.data && data.data
        }
        return data
    }

    /**
     * 获取消息发送
     * @param value
     * @returns {Promise<*>}
     */
    @action
    findTaskMessagePage = async value =>{
        return await Axios.post("/pipeline/message/findTaskMessagePage",value)
    }

    /**
     * 获取消息发送
     * @param value
     * @returns {Promise<*>}
     */
    @action
    findTaskMessageList = async value =>{
        return await Axios.post("/pipeline/message/findTaskMessageList",value)
    }

    /**
     * 添加消息发送
     * @param value
     * @returns {Promise<*>}
     */
    @action
    createTaskMessage = async value =>{
        const data = await Axios.post("/pipeline/message/createTaskMessage",value);
        if(data.code===0){
            message.success('添加成功')
        } else {
            message.error('添加失败')
        }
        return data
    }

    /**
     * 更新消息发送
     * @param value
     * @returns {Promise<*>}
     */
    @action
    updateTaskMessage = async value =>{
        const data = await Axios.post("/pipeline/message/updateTaskMessage",value);
        if(data.code===0){
            message.success('更新成功')
        } else {
            message.error('更新失败')
        }
        return data
    }


    /**
     * 删除消息发送
     * @param value
     * @returns {Promise<*>}
     */
    @action
    deleteTaskMessage = async value =>{
        const id = new FormData();
        id.append('id',value)
        const data = await Axios.post("/pipeline/message/deleteTaskMessage",id);
        if(data.code===0){
            message.success('删除成功')
        } else {
            message.error('删除失败')
        }
        return data
    }

}

const pipelineMessageStore = new PipelineMessageStore();
export default pipelineMessageStore
