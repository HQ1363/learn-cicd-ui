/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/6/24
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/6/24
 */
import {Axios} from "tiklab-core-ui";
import {action} from "mobx";


class TestCountStore {

    @action
    findTestCount = async value =>{
        const pipelineId = new FormData();
        pipelineId.append('pipelineId',value)
        return await Axios.post('/pipeline/testCount/findTestCount',pipelineId)
    }

    @action
    findTestCodeScanCount = async value =>{
        const pipelineId = new FormData();
        pipelineId.append('pipelineId',value)
        return await Axios.post('/pipeline/testCount/findTestCodeScanCount',pipelineId)
    }

    @action
    findTestTestHuboCount = async value =>{
        const pipelineId = new FormData();
        pipelineId.append('pipelineId',value)
        return await Axios.post('/pipeline/testCount/findTestTestHuboCount',pipelineId)
    }


}

export default new TestCountStore();
