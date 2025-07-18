import {action} from "mobx";
import {Axios} from "tiklab-core-ui";

class StatisticsStore {

    /**
     * 发布次数TOP10统计
     * @returns {Promise | Promise<unknown>}
     */
    @action
    findDayRateCount = async data => {
        return await Axios.post('/pipeline/count/findDayRateCount',data);
    }

    /**
     * 近七天时间
     */
    @action
    findRecentDaysFormatted = async data => {
        const value = new  FormData();
        value.append('day',7)
        return await Axios.post('/pipeline/count/findRecentDaysFormatted',value);
    }

    /**
     * 运行统计
     */
    @action
    findRunResultSpan = async data => {
        return await Axios.post('/pipeline/count/findRunResultSpan',data);
    }

    /**
     * 时间段统计
     * @returns {Promise | Promise<unknown>}
     */
    @action
    findRunTimeSpan = async data => {
        return await Axios.post('/pipeline/count/findRunTimeSpan',data);
    }

    /**
     * 结果次数统计
     * @returns {Promise | Promise<unknown>}
     */
    @action
    findRunNumberSpan = async data => {
        return await Axios.post('/pipeline/count/findRunNumberSpan',data);
    }

    /**
     * 状态统计
     */
    @action
    findPipelineInstanceCount = async data => {
        const value = new FormData();
        value.append('pipelineId',data)
        return await Axios.post('/pipeline/count/findPipelineInstanceCount',value);
    }



}


export default new StatisticsStore();
