import {action} from "mobx";
import {Axios} from "tiklab-core-ui";
import {message} from "antd";

class CodeThirdStore {

    /**
     * 获取gitpuk仓库
     * @param value
     * @returns {Promise<void>}
     */
    @action
    findGittokRpy = async value =>{
        const data = await Axios.post("/code/third/gittok/findStoreHouseList",value)
        if(data.code!==0){
            message.error(data.msg)
        }
        return data
    }

    /**
     * 获取gitpuk分支
     * @param value
     * @returns {Promise<void>}
     */
    @action
    findGittokBranch = async value =>{
        const data =  await Axios.post("/code/third/gittok/findHouseBranchList",value)
        if(data.code!==0){
            message.error(data.msg)
        }
        return data
    }

    /**
     * 获取Gitee仓库
     * @param value
     * @returns {Promise<void>}
     */
    @action
    findGiteeRpy = async value =>{
        const data = await Axios.post("/code/third/gitee/findStoreHouseList",value)
        if(data.code!==0){
            message.error(data.msg)
        }
        return data
    }

    /**
     * 获取Gitee分支
     * @param value
     * @returns {Promise<void>}
     */
    @action
    findGiteeBranch = async value =>{
        const data =  await Axios.post("/code/third/gitee/findHouseBranchList",value)
        if(data.code!==0){
            message.error(data.msg)
        }
        return data
    }

    /**
     * 获取Github仓库
     * @param value
     * @returns {Promise<void>}
     */
    @action
    findGithubRpy = async value =>{
        const data = await Axios.post("/code/third/github/findStoreHouseList",value)
        if(data.code!==0){
            message.error(data.msg)
        }
        return data
    }

    /**
     * 获取gitlab分支
     * @param value
     * @returns {Promise<void>}
     */
    @action
    findGithubBranch = async value =>{
        const data =  await Axios.post("/code/third/github/findHouseBranchList",value)
        if(data.code!==0){
            message.error(data.msg)
        }
        return data
    }

    /**
     * 获取gitlab仓库
     * @param value
     * @returns {Promise<void>}
     */
    @action
    findGitlabRpy = async value =>{
        const data = await Axios.post("/code/third/gitlab/findStoreHouseList",value)
        if(data.code!==0){
            message.error(data.msg)
        }
        return data
    }

    /**
     * 获取gitlab分支
     * @param value
     * @returns {Promise<void>}
     */
    @action
    findGitlabBranch = async value =>{
        const data =  await Axios.post("/code/third/gitlab/findHouseBranchList",value)
        if(data.code!==0){
            message.error(data.msg)
        }
        return data
    }

    /**
     * 获取自建gitlab仓库
     * @param value
     * @returns {Promise<void>}
     */
    @action
    findPriGitlabRpy = async value =>{
        const data = await Axios.post("/code/third/pri/v4/gitlab/findStoreHouseList",value)
        if(data.code!==0){
            message.error(data.msg)
        }
        return data
    }

    /**
     * 获取自建gitlab分支
     * @param value
     * @returns {Promise<void>}
     */
    @action
    findPriGitlabBranch = async value =>{
        const data = await Axios.post("/code/third/pri/v4/gitlab/findHouseBranchList",value)
        if(data.code!==0){
            message.error(data.msg)
        }
        return data
    }

    /**
     * 获取gitea仓库
     * @param value
     * @returns {Promise<void>}
     */
    @action
    findGiteaRpy = async value =>{
        const data = await Axios.post("/code/third/pri/gitea/findStoreHouseList",value)
        if(data.code!==0){
            message.error(data.msg)
        }
        return data
    }

    /**
     * 获取gitea分支
     * @param value
     * @returns {Promise<void>}
     */
    @action
    findGiteaBranch = async value =>{
        const data = await Axios.post("/code/third/pri/gitea/findHouseBranchList",value)
        if(data.code!==0){
            message.error(data.msg)
        }
        return data
    }

}

export default new CodeThirdStore()
