/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/6/3
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/6/3
 */
import {action, observable} from "mobx";
import {Axios} from "tiklab-core-ui";
import {message} from "antd";

class WebhookStore {

    /**
     * 获取WebHook
     * @param value
     * @returns {Promise<unknown>}
     */
    @action
    findPipelineWebHook = async value=>{
        const param = new FormData();
        param.append('pipelineId',value);
        return await Axios.post('/pipeline/webhook/findPipelineWebHook',param)
    }

    /**
     * 更新WebHook
     * @param value
     * @returns {Promise<unknown>}
     */
    @action
    updateWebHook = async value=>{
        return await Axios.post('/pipeline/webhook/updateWebHook',value)
    }

}

export default new WebhookStore();
