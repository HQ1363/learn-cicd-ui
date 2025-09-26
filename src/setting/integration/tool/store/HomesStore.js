/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/9/17
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/9/17
 */
import {action} from "mobx";
import {service} from "../../../../common/utils/Requset";

class HomesStore {

    @action
    findToolsType = async values =>{
        return await service.post('https://install.tiklab.net/tools/findToolsTypeList',values)
    }

    @action
    findToolsVersionList = async values =>{
        return await service.post('https://install.tiklab.net/tools/findToolsVersionList',values)
    }

}


export default new HomesStore();
