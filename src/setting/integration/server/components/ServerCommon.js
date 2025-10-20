/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/4/7
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/4/7
 */
import {
    serverGitee,
    serverGithub,
    serverGitlab,
    serverPriGitlab,
    serverSonar,
    serverNexus,
    serverGitpuk,
    serverPostIn,
    serverHadess,
    serverSourceFare, serverGitea
} from "../../../../common/utils/Constant";
import pip_gitee from "../../../../assets/images/svg/pip_gitee.svg";
import pip_github from "../../../../assets/images/svg/pip_github.svg";
import pip_gitlab from "../../../../assets/images/svg/pip_gitlab.svg";
import pip_sonar from "../../../../assets/images/svg/pip_sonar.svg";
import pip_nexus from "../../../../assets/images/svg/pip_nexus.svg";
import pip_gitea from "../../../../assets/images/svg/pip_gitea.svg";
import {productImg} from "tiklab-core-ui";

//工具类型
export const serverList = [
    serverGitee,
    serverGithub,
    serverGitlab,
    serverPriGitlab,
    serverGitpuk,
    serverPostIn,
    serverSonar,
    serverNexus,
    serverHadess,
    serverSourceFare,
    serverGitea
];

//工具名称
export const serverTitle = {
    [serverGitee]: 'Gitee',
    [serverGithub]: 'GitHub',
    [serverGitlab]: 'GitLab',
    [serverPriGitlab]: '自建GitLab',
    [serverSonar]: 'SonarQube',
    [serverNexus]: 'Nexus',
    [serverGitpuk]: 'GitPuk',
    [serverPostIn]: 'PostIn',
    [serverHadess]: 'Hadess',
    [serverSourceFare]: 'SourceFare',
    [serverGitea]: 'Gitea',
}

//工具类型
export const serverDesc = {
    [serverGitee]: 'Gitee',
    [serverGithub]: 'GitHub',
    [serverGitlab]: 'GitLab',
    [serverPriGitlab]: '自建GitLab',
    [serverSonar]: 'SonarQube',
    [serverNexus]: 'Nexus',
    [serverGitpuk]: 'GitPuk',
    [serverPostIn]: 'PostIn',
    [serverHadess]: 'Hadess',
    [serverSourceFare]: 'SourceFare',
    [serverGitea]: 'Gitea',
};

//工具图片
export const serverImage = {
    [serverGitee]: pip_gitee,
    [serverGithub]: pip_github,
    [serverGitlab]: pip_gitlab,
    [serverPriGitlab]: pip_gitlab,
    [serverSonar]: pip_sonar,
    [serverNexus]: pip_nexus,
    [serverGitea]: pip_gitea,
    [serverGitpuk]: productImg.gitpuk,
    [serverPostIn]: productImg.postin,
    [serverHadess]: productImg.hadess,
    [serverSourceFare]: productImg.sourcefare,
}
