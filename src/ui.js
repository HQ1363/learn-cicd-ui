import {store as pipelineStore} from "./store";
import App from "./app";
import Portal from "./common/layout/Portal";
import SettingAside from "./common/component/aside/SettingAside";
import PipelineSetAside from "./common/component/aside/PipelineSetAside";
import PipelineTwoAside from "./common/component/aside/PipelineTwoAside";
import AsyncComponent from "./common/lazy/SyncComponent";
import PipelineAside from "./pipeline/navigator/PipelineAside";

const Index=AsyncComponent(()=>import("./common/layout/Layout"))

const Login=AsyncComponent(()=>import("./login/Login"))
const LoginRpw=AsyncComponent(()=>import("./login/LoginRpw"))
const SysException=AsyncComponent(()=>import("./login/SysException"))

const Logout=AsyncComponent(()=>import("./login/Logout"))
const ExcludeProductUser=AsyncComponent(()=>import("./login/ExcludeProductUser"))
const NotFound=AsyncComponent(()=>import("./login/NotFound"))

const NoAccess=AsyncComponent(()=>import("./setting/privilege/NoAccess"))

/**
 * 首页
 */
const HomePage=AsyncComponent(()=>import("./home/components/HomePage"))

/**
 * 流水线
 */
const Pipeline=AsyncComponent(()=>import("./pipeline/pipeline/components/Pipeline"))
const PipelineDetail=AsyncComponent(()=>import("./pipeline/navigator/PipelineDetail"))
const Overview=AsyncComponent(()=>import("./pipeline/overview/components/Overview"))
const Dynamic=AsyncComponent(()=>import("./pipeline/overview/components/Dynamic"))
const Design=AsyncComponent(()=>import("./pipeline/design/navigator/Design"))
const DesignProcess=AsyncComponent(()=>import("./pipeline/design/processDesign/gui/component/Gui"))
const DesignTrigger=AsyncComponent(()=>import("./pipeline/design/trigger/components/Trigger"))
const DesignVariable=AsyncComponent(()=>import("./pipeline/design/variable/components/Variable"))
const DesignPostprocess=AsyncComponent(()=>import("./pipeline/design/message/components/Message"))
const Authorize=AsyncComponent(()=>import("./pipeline/authorize/Authorize"))
const History=AsyncComponent(()=>import("./pipeline/history/components/History"))
const HistoryInstance=AsyncComponent(()=>import("./pipeline/history/components/HistoryInstance"))
const Test=AsyncComponent(()=>import("./pipeline/test/navigator/Test"))
const TestOverview=AsyncComponent(()=>import("./pipeline/test/overview/component/TestOverview"))
const TestHubo=AsyncComponent(()=>import("./pipeline/test/testhubo/component/TestHubo"))
const TestMaven=AsyncComponent(()=>import("./pipeline/test/maven/component/TestMaven"))
const TestSpotbugs=AsyncComponent(()=>import("./pipeline/test/spotbugs/component/SpotbugsScan"))
const TestSonarQube=AsyncComponent(()=>import("./pipeline/test/sonarQube/component/SonarQubeScan"))
const TestSourceFare=AsyncComponent(()=>import("./pipeline/test/sourcefare/component/SourceFareScan"))
const PipelineSetting=AsyncComponent(()=>import("./pipeline/setting/navigator/PipelineSetting"))
const BasicInfo=AsyncComponent(()=>import("./pipeline/setting/basicInfo/BasicInfo"))

/**
 * 系统设置
 */
const Setting=AsyncComponent(()=>import("./setting/navigator/Setting"))
const SettingHome=AsyncComponent(()=>import("./setting/home/component/SettingHome"))
const Auth=AsyncComponent(()=>import("./setting/configure/auth/components/Auth"))
const Host=AsyncComponent(()=>import("./setting/configure/host/component/Host"))
const HostGroup=AsyncComponent(()=>import("./setting/configure/host/component/HostGroup"))
const Resources=AsyncComponent(()=>import("./setting/resources/component/Resources"))
const Grouping=AsyncComponent(()=>import("./setting/configure/grouping/component/Grouping"))
const Env=AsyncComponent(()=>import("./setting/configure/env/component/Env"))
const Agent=AsyncComponent(()=>import('./setting/configure/agent/component/Agent'))
const Server=AsyncComponent(()=>import("./setting/integration/server/components/Server"))
const ServerDetail=AsyncComponent(()=>import("./setting/integration/server/components/ServerDetail"))
const Tool=AsyncComponent(()=>import("./setting/integration/tool/components/Tool"))
const ToolDetail=AsyncComponent(()=>import("./setting/integration/tool/components/ToolDetail"))

const K8s=AsyncComponent(()=>import('./setting/configure/k8s/components/K8s'))
const Variable=AsyncComponent(()=>import('./setting/configure/variable/component/Variable'))

// message
const Message=AsyncComponent(()=>import("./setting/message/Message"))
const MessageSendType=AsyncComponent(()=>import("./setting/message/MessageSendType"))
const MessageNotice=AsyncComponent(()=>import("./setting/message/MessageNotice"))
const DomainMessageNotice=AsyncComponent(()=>import("./setting/message/DomainMessageNotice"))

// security
const BackupRestore=AsyncComponent(()=>import("./setting/security/BackupRestore"))
const RequestError=AsyncComponent(()=>import("./setting/security/RequestError"))

// user
const User=AsyncComponent(()=>import("./setting/user/User"))
const Directory=AsyncComponent(()=>import("./setting/user/Directory"))
const Orga=AsyncComponent(()=>import("./setting/user/Orga"))
const UserGroup=AsyncComponent(()=>import("./setting/user/Group"))
const DomainUser=AsyncComponent(()=>import("./setting/user/DomainUser"))

// privilege
const DomainRole=AsyncComponent(()=>import("./setting/privilege/DomainRole"))
const SystemRole=AsyncComponent(()=>import("./setting/privilege/SystemRole"))

// licence
const Version=AsyncComponent(()=>import("./setting/licence/Version"))
const ProductAuth=AsyncComponent(()=>import("./setting/licence/ProductAuth"))

//系统集成
const OpenApi=AsyncComponent(()=>import("./setting/integration/openApi/OpenApi"))
const OpenApiDoc=AsyncComponent(()=>import("./setting/integration/openApi/OpenApiDoc"))

// base
const UserGroupTrue=AsyncComponent(()=>import("./setting/base/user/Groupture"))
const SystemFeature=AsyncComponent(()=>import("./setting/base/privilege/SystemFeature"))
const SystemRoleTrue=AsyncComponent(()=>import("./setting/base/privilege/SystemRoleTrue"))
const ProjectRole=AsyncComponent(()=>import("./setting/base/privilege/ProjectRole"))
const ProjectFeature=AsyncComponent(()=>import("./setting/base/privilege/ProjectFeature"))
const ProjectVirtualRole=AsyncComponent(()=>import("./setting/base/privilege/ProjectVirtualRole"))

const MyTodoTask=AsyncComponent(()=>import("./setting/base/message/MyTodoTask"))
const Task=AsyncComponent(()=>import("./setting/base/message/Task"))
const TodoTemp=AsyncComponent(()=>import("./setting/base/message/TodoTemp"))
const TodoType=AsyncComponent(()=>import("./setting/base/message/TodoType"))

const LogTemplate=AsyncComponent(()=>import("./setting/base/log/LogTemplate"))
const LogType=AsyncComponent(()=>import("./setting/base/log/LogType"))

const MessageSendTypeTrue=AsyncComponent(()=>import("./setting/base/message/MessageSendType"))
const MessageType=AsyncComponent(()=>import("./setting/base/message/MessageType"))
const SystemMessageNotice=AsyncComponent(()=>import("./setting/base/message/SystemMessageNotice"))
const ProjectMessageNotice=AsyncComponent(()=>import("./setting/base/message/ProjectMessageNotice"))

export {
    AsyncComponent,

    pipelineStore,
    App,
    Portal,
    SettingAside,
    PipelineSetAside,
    PipelineTwoAside,
    PipelineAside,

    Index,
    Login,
    LoginRpw,
    SysException,
    Logout,
    ExcludeProductUser,
    NotFound,
    NoAccess,

    HomePage,

    Pipeline,
    PipelineDetail,
    Overview,
    Dynamic,

    Design,
    DesignProcess,
    DesignTrigger,
    DesignVariable,
    DesignPostprocess,

    Authorize,

    History,
    HistoryInstance,

    Test,
    TestOverview,
    TestSpotbugs,
    TestSonarQube,
    TestSourceFare,
    TestHubo,
    TestMaven,

    PipelineSetting,
    BasicInfo,
    DomainMessageNotice,
    DomainUser,
    DomainRole,

    Setting,

    SettingHome,

    Grouping,
    Env,
    Auth,
    Host,
    HostGroup,
    Tool,
    ToolDetail,
    Resources,
    Agent,
    Server,
    ServerDetail,
    K8s,
    Variable,

    Message,
    MessageSendType,
    MessageNotice,
    BackupRestore,
    RequestError,

    User,
    UserGroup,
    Orga,
    Directory,
    SystemRole,
    Version,
    ProductAuth,
    OpenApi,
    OpenApiDoc,

    UserGroupTrue,
    SystemFeature,
    SystemRoleTrue,
    ProjectRole,
    ProjectFeature,
    ProjectVirtualRole,
    MyTodoTask,
    Task,
    TodoTemp,
    TodoType,
    LogTemplate,
    LogType,
    MessageSendTypeTrue,
    MessageType,
    SystemMessageNotice,
    ProjectMessageNotice,
}


