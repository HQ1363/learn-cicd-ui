/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/7/23
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/7/23
 */
import {action} from "mobx";
import {Axios} from "tiklab-core-ui";
import {message} from "antd";

class VariableStore {

    /**
     * 查询变量
     * @param value
     * @returns {Promise<void>}
     */
    @action
    findSystemVariablePage = async value =>{
        return await Axios.post('/system/variable/findSystemVariablePage', value);
    }

    /**
     * 添加变量
     * @param value
     * @returns {Promise<void>}
     */
    @action
    createSystemVariable = async value =>{
        const data = await Axios.post('/system/variable/createSystemVariable',value);
        if(data.code===0){
            message.success('添加成功')
        } else {
            message.error(data.msg)
        }
        return data;
    }

    /**
     * 删除变量
     * @param value
     * @returns {Promise<void>}
     */
    @action
    deleteSystemVariable = async value =>{
        const id = new FormData();
        id.append('id',value);
        const data = await Axios.post('/system/variable/deleteSystemVariable',id);
        if(data.code===0){
            message.success('删除成功')
        } else {
            message.error(data.msg)
        }
        return data;
    }

    /**
     * 更新变量
     * @param value
     * @returns {Promise<void>}
     */
    @action
    updateSystemVariable = async value =>{
        const data = await Axios.post('/system/variable/updateSystemVariable',value);
        if(data.code===0){
            message.success('修改成功')
        } else {
            message.error(data.msg)
        }
        return data;
    }


}

export default new VariableStore();
