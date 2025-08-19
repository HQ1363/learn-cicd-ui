/**
 * @Description: 常量
 * @Author: gaomengyuan
 * @Date: 2025/3/28
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/28
 */

/**
 * 任务常量
 */
export const git = 'git'; //通用Git
export const gitee = 'gitee'; //Gitee
export const github = 'github'; //Github
export const gitlab = 'gitlab'; //Github
export const pri_gitlab = 'pri_gitlab'; //自建Github
export const svn = 'svn'; //Svn
export const gitpuk = 'gitpuk'; //GitPuk
export const maventest = 'maventest'; //Maven单元测试
export const testhubo = 'testhubo'; //TestHubo自动化测试
export const mvn = 'maven'; //Maven构建
export const nodejs = 'nodejs'; //Node.Js构建
export const build_docker = 'build_docker'; //Docker构建
export const build_go = 'build_go'; //GO构建
export const build_python = 'build_python'; //python构建
export const build_php = 'build_php'; //php构建
export const build_net_core = "build_net_core"; //.net core 构建
export const build_gradle = "build_gradle"; //gradle 构建
export const build_c_add = "build_c_add"; //c++ 构建
export const liunx = 'liunx'; //主机部署
export const docker = 'docker'; //Docker部署
export const k8s = 'k8s'; //Kubernetes部署
export const sonar = 'sonar'; //SonarQubeScan
export const spotbugs = 'spotbugs'; //spotBugs-Java代码扫描
export const sourcefare = 'sourcefare'; //sourceFare代码扫描
export const upload_hadess= 'upload_hadess'; //hadess上传
export const upload_ssh= 'upload_ssh'; //ssh上传
export const upload_nexus= 'upload_nexus'; //nexus上传
export const download_hadess = 'download_hadess'; //hadess下载
export const download_ssh = 'download_ssh'; //ssh下载
export const download_nexus = 'download_nexus'; //nexus下载
export const checkpoint = 'checkpoint'; //人工卡点
export const script = 'script'; //执行脚本
export const message = 'message'; //消息通知
export const post = 'post'; //后置处理
export const host_order = 'host_order'; //主机命令
export const host_strategy = 'host_strategy'; //主机策略
// 任务自定义常量
export const host_blue_green = 'host_blue_green'; //主机蓝绿部署
export const docker_blue_green = 'docker_blue_green'; //Docker蓝绿部署
export const k8s_blue_green = 'k8s_blue_green'; //Kubernetes蓝绿部署

/**
 * 服务常量
 */
export const serverGitee = 'gitee';
export const serverGithub = 'github';
export const serverGitlab = 'gitlab';
export const serverPriGitlab = 'pri_gitlab';
export const serverGitpuk = 'gitpuk';
export const serverTesthubo = 'testhubo';
export const serverSonar = 'sonar';
export const serverNexus = 'nexus';
export const serverHadess = 'hadess';
export const serverSourceFare = 'sourcefare';

/**
 * 工具常量
 */
export const toolJdk = 'jdk';
export const toolGit = 'git';
export const toolSvn = 'svn';
export const toolMaven = 'maven';
export const toolNode = 'nodejs';
export const toolGo = 'go';
export const toolK8s = 'k8s';
export const toolSonarScanner = 'sonar-scanner';
export const toolSourceFareScanner = 'sourcefare-scanner';

/**
 * 权限
 */
export const pipeline_task_update = 'pipeline_task_update'; //流水线更新
export const pipeline_task_run = 'pipeline_task_run'; //流水线运行

/**
 * 运行状态
 */
export const runError = "error";  //失败
export const runSuccess = "success"; //成功
export const runHalt = "halt"; //终止
export const runRun = "run"; //运行中
export const runWait = "wait"; //等待
export const runSuspend = "suspend"; //暂停
export const runTimeout = "timeout"; //超时
