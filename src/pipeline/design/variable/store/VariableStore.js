import {action, observable} from "mobx";
import {Axios} from "tiklab-core-ui";
import {message} from "antd";

class VariableStore{

    /**
     * 添加变量
     * @param value
     * @returns {Promise<*>}
     */
    @action
    createVariable = async value =>{
        const data = await Axios.post("/pipeline/variable/createVariable",value)
        if(data.code===0){
            message.success('添加成功')
        } else {
            message.error('添加失败')
        }
        return data
    }

    /**
     * 删除变量
     */
    @action
    deleteVariable = async value =>{
        const param = new FormData()
        param.append("varId",value)
        const data = await Axios.post("/pipeline/variable/deleteVariable",param)
        if(data.code===0){
            message.success('删除成功')
        } else {
            message.error('删除失败')
        }
        return data
    }

    /**
     * 更新变量
     * @param value
     * @returns {Promise<*>}
     */
    @action
    updateVariable = async value =>{
        const data = await Axios.post("/pipeline/variable/updateVariable",value)
        if(data.code===0){
            message.success('更新成功')
        } else {
            message.error('更新失败')
        }
        return data
    }

    /**
     * 获取所有变量
     */
    @action
    findVariablePage = async (value) =>{
        return await Axios.post("/pipeline/variable/findVariablePage", value)
    }

    /**
     * 获取所有变量
     */
    @action
    findVariableList = async (value) =>{
        return await Axios.post("/pipeline/variable/findVariableList", value)
    }

}

const variableStore = new VariableStore();
export default variableStore
