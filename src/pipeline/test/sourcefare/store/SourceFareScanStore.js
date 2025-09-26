/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/5/29
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/5/29
 */
import {action} from "mobx";
import {Axios} from "tiklab-core-ui";
import {message} from "antd";


class SourceFareScanStore {

    /**
     * 获取SourceFare
     * @param value
     * @returns {Promise<unknown>}
     */
    @action
    findSourceFareProjectList = async value =>{
        const data = await Axios.post('/sourceFare/remote/findSourceFareProjectList',value)
        if(data.code !==0 ){
            message.error(data.msg)
        }
        return data;
    }

    /**
     * 获取SourceFare
     * @param value
     * @returns {Promise<unknown>}
     */
    @action
    findSourceFareScanPage = async value =>{
        return await Axios.post('/sourceFareScan/findSourceFareScanPage',value)
    }

    /**
     * 删除SourceFare
     * @param value
     * @returns {Promise<unknown>}
     */
    @action
    deleteSourceFareScan = async value =>{
        const id = new FormData();
        id.append('id',value)
        const data = await Axios.post('/sourceFareScan/deleteSourceFareScan',id);
        if(data.code===0){
            message.success('删除成功')
        } else {
            message.error('删除失败')
        }
        return data
    }


}

export default new SourceFareScanStore();
