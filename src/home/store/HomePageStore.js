import {action} from "mobx";
import {Axios, getUser} from "tiklab-core-ui";

class HomePageStore{

    /**
     * 获取最近打开的流水线
     * @param value
     * @returns {Promise<*>}
     */
    @action
    findOpenPage = async value =>{
        return await Axios.post("/open/findOpenPage", {
            ...value,
            userId: getUser().userId
        })
    }

    /**
     * 获取最近构建的流水线
     * @returns {Promise<unknown>}
     */
    findPipelineRecently = async value =>{
        const param = new FormData()
        param.append("number",value)
        param.append('userId',getUser().userId)
        const data = await Axios.post('/pipeline/findPipelineRecently',param)
        return data
    }

}

const homePageStore = new HomePageStore();
export default homePageStore;
