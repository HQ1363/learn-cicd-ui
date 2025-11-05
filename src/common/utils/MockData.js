/**
 * Mock 数据配置
 * 用于本地开发绕过登录限制
 */

// 通用成功响应
const successResponse = (data = null) => ({
    code: 0,
    msg: 'success',
    data: data
});

// 通用分页响应
const pageResponse = (dataList = [], totalRecord = 0) => ({
    code: 0,
    msg: 'success',
    data: {
        dataList: dataList,
        totalRecord: totalRecord,
        totalPage: Math.ceil(totalRecord / 10),
        currentPage: 1
    }
});

// 模拟数据存储（内存中）
let mockPipelines = [
    {
        id: 'pipeline-001',
        name: 'Web前端构建流水线',
        description: '用于前端项目的构建、测试和部署',
        status: 'success',
        color: '#1890ff',
        createTime: '2024-01-01 10:00:00',
        createUserId: 'mock-user-001',
        pipelinePower: 1,
        groupId: 'group-001',
        envId: 'env-001',
        pipelineFollow: 0
    },
    {
        id: 'pipeline-002',
        name: 'Java后端服务流水线',
        description: '用于Java项目的编译、打包和发布',
        status: 'running',
        color: '#52c41a',
        createTime: '2024-01-02 11:00:00',
        createUserId: 'mock-user-001',
        pipelinePower: 1,
        groupId: 'group-001',
        envId: 'env-002',
        pipelineFollow: 1
    },
    {
        id: 'pipeline-003',
        name: 'Docker镜像构建流水线',
        description: '构建并推送Docker镜像',
        status: 'failed',
        color: '#faad14',
        createTime: '2024-01-03 12:00:00',
        createUserId: 'mock-user-001',
        pipelinePower: 2,
        groupId: 'group-002',
        envId: 'env-003',
        pipelineFollow: 0
    }
];

let pipelineIdCounter = 4;

// 🔄 动态任务和阶段存储（支持实时增删改查）
// 结构: { pipelineId: { stages: [...], tasks: [...] } }
let pipelineDesignData = {
    // 示例数据（可以为空，让用户自己添加）
};

// 任务ID计数器
let taskIdCounter = 1000;
let stageIdCounter = 1000;

// ==================== 动态状态管理辅助函数 ====================

/**
 * 获取流水线的初始阶段数据（仅在首次访问时初始化）
 */
const getInitialStages = (pipelineId) => [
    {
        stageId: "stage-init-001",
        stageName: "源码",
        createTime: new Date().toLocaleString('zh-CN'),
        pipelineId: pipelineId,
        stageSort: 1,
        parentId: null,
        code: true,
        taskValues: null,
        stageList: [
            {
                stageId: "stage-init-001-1",
                stageName: "源码",
                createTime: new Date().toLocaleString('zh-CN'),
                pipelineId: null,
                stageSort: 1,
                parentId: "stage-init-001",
                code: false,
                taskValues: [
                    {
                        taskId: "task-init-001",
                        createTime: new Date().toLocaleString('zh-CN'),
                        taskType: "git",
                        taskSort: 1,
                        taskName: "通用Git",
                        pipelineId: null,
                        postprocessId: null,
                        stageId: "stage-init-001-1",
                        task: null,
                        instanceId: null,
                        taskVariable: null,
                        fieldStatus: 1
                    }
                ],
                stageList: null,
                taskType: null,
                taskName: null,
                taskId: null,
                values: null,
                taskSort: 0,
                parallelName: null,
                instanceId: null,
                mainStageId: null
            }
        ],
        taskType: null,
        taskName: null,
        taskId: null,
        values: null,
        taskSort: 0,
        parallelName: null,
        instanceId: null,
        mainStageId: null
    },
    {
        stageId: "stage-init-002",
        stageName: "构建",
        createTime: new Date().toLocaleString('zh-CN'),
        pipelineId: pipelineId,
        stageSort: 2,
        parentId: null,
        code: false,
        taskValues: null,
        stageList: [
            {
                stageId: "stage-init-002-1",
                stageName: "并行阶段-2-1",
                createTime: new Date().toLocaleString('zh-CN'),
                pipelineId: null,
                stageSort: 1,
                parentId: "stage-init-002",
                code: false,
                taskValues: [
                    {
                        taskId: "task-init-002",
                        createTime: new Date().toLocaleString('zh-CN'),
                        taskType: "maven",
                        taskSort: 1,
                        taskName: "Maven构建",
                        pipelineId: null,
                        postprocessId: null,
                        stageId: "stage-init-002-1",
                        task: null,
                        instanceId: null,
                        taskVariable: null,
                        fieldStatus: 1
                    }
                ],
                stageList: null,
                taskType: null,
                taskName: null,
                taskId: null,
                values: null,
                taskSort: 0,
                parallelName: null,
                instanceId: null,
                mainStageId: null
            }
        ],
        taskType: null,
        taskName: null,
        taskId: null,
        values: null,
        taskSort: 0,
        parallelName: null,
        instanceId: null,
        mainStageId: null
    },
    {
        stageId: "stage-init-003",
        stageName: "部署",
        createTime: new Date().toLocaleString('zh-CN'),
        pipelineId: pipelineId,
        stageSort: 3,
        parentId: null,
        code: false,
        taskValues: null,
        stageList: [
            {
                stageId: "stage-init-003-1",
                stageName: "并行阶段-3-1",
                createTime: new Date().toLocaleString('zh-CN'),
                pipelineId: null,
                stageSort: 1,
                parentId: "stage-init-003",
                code: false,
                taskValues: [
                    {
                        taskId: "task-init-003",
                        createTime: new Date().toLocaleString('zh-CN'),
                        taskType: "liunx",
                        taskSort: 1,
                        taskName: "主机部署",
                        pipelineId: null,
                        postprocessId: null,
                        stageId: "stage-init-003-1",
                        task: null,
                        instanceId: null,
                        taskVariable: null,
                        fieldStatus: 1
                    }
                ],
                stageList: null,
                taskType: null,
                taskName: null,
                taskId: null,
                values: null,
                taskSort: 0,
                parallelName: null,
                instanceId: null,
                mainStageId: null
            }
        ],
        taskType: null,
        taskName: null,
        taskId: null,
        values: null,
        taskSort: 0,
        parallelName: null,
        instanceId: null,
        mainStageId: null
    }
];

/**
 * 确保流水线有初始化的数据结构
 */
const ensurePipelineData = (pipelineId) => {
    if (!pipelineDesignData[pipelineId]) {
        console.log('[Mock] 📝 初始化流水线数据:', pipelineId);
        pipelineDesignData[pipelineId] = {
            stages: getInitialStages(pipelineId)
        };
    }
    return pipelineDesignData[pipelineId];
};

/**
 * 在阶段列表中添加任务
 */
const addTaskToStage = (stages, stageId, newTask) => {
    for (let stage of stages) {
        if (stage.stageList) {
            for (let subStage of stage.stageList) {
                if (subStage.stageId === stageId) {
                    if (!subStage.taskValues) {
                        subStage.taskValues = [];
                    }
                    subStage.taskValues.push(newTask);
                    console.log('[Mock] ✅ 任务已添加到阶段:', stageId, newTask.taskName);
                    return true;
                }
            }
        }
    }
    return false;
};

/**
 * 在阶段列表中更新任务
 */
const updateTaskInStage = (stages, taskId, updatedData) => {
    for (let stage of stages) {
        if (stage.stageList) {
            for (let subStage of stage.stageList) {
                if (subStage.taskValues) {
                    const taskIndex = subStage.taskValues.findIndex(t => t.taskId === taskId);
                    if (taskIndex !== -1) {
                        subStage.taskValues[taskIndex] = {
                            ...subStage.taskValues[taskIndex],
                            ...updatedData
                        };
                        console.log('[Mock] ✅ 任务已更新:', taskId);
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

/**
 * 在阶段列表中删除任务
 */
const deleteTaskFromStage = (stages, taskId) => {
    for (let stage of stages) {
        if (stage.stageList) {
            for (let subStage of stage.stageList) {
                if (subStage.taskValues) {
                    const taskIndex = subStage.taskValues.findIndex(t => t.taskId === taskId);
                    if (taskIndex !== -1) {
                        subStage.taskValues.splice(taskIndex, 1);
                        console.log('[Mock] ✅ 任务已删除:', taskId);
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

// Mock 数据映射表
const mockDataMap = {
    // 流水线相关 - 查询单个
    '/pipeline/findPipeline': (data) => {
        const pipeline = mockPipelines.find(p => p.id === data?.id);
        return successResponse(pipeline || mockPipelines[0]);
    },
    
    // 流水线相关 - 分页查询
    '/pipeline/findPipelinePage': (data) => {
        let filteredPipelines = [...mockPipelines];
        
        // 按名称过滤
        if (data?.pipelineName) {
            filteredPipelines = filteredPipelines.filter(p => 
                p.name.toLowerCase().includes(data.pipelineName.toLowerCase())
            );
        }
        
        // 按创建人过滤
        if (data?.createUserId) {
            filteredPipelines = filteredPipelines.filter(p => p.createUserId === data.createUserId);
        }
        
        // 按应用过滤
        if (data?.groupId) {
            filteredPipelines = filteredPipelines.filter(p => p.groupId === data.groupId);
        }
        
        // 按环境过滤
        if (data?.envId) {
            filteredPipelines = filteredPipelines.filter(p => p.envId === data.envId);
        }
        
        // 按权限过滤
        if (data?.pipelinePower) {
            filteredPipelines = filteredPipelines.filter(p => p.pipelinePower === data.pipelinePower);
        }
        
        // 按收藏过滤
        if (data?.pipelineFollow) {
            filteredPipelines = filteredPipelines.filter(p => p.pipelineFollow === data.pipelineFollow);
        }
        
        return pageResponse(filteredPipelines, filteredPipelines.length);
    },
    
    // 流水线列表（不分页）
    '/pipeline/findPipelineList': () => {
        return successResponse(mockPipelines);
    },
    
    // 用户流水线分页
    '/pipeline/findUserPipelinePage': (data) => {
        return mockDataMap['/pipeline/findPipelinePage'](data);
    },
    
    // 流水线统计
    '/pipeline/findPipelineCount': () => {
        return successResponse({
            pipelineNumber: mockPipelines.length,
            userPipelineNumber: mockPipelines.filter(p => p.createUserId === 'mock-user-001').length,
            userFollowNumber: mockPipelines.filter(p => p.pipelineFollow === 1).length
        });
    },
    
    // 创建流水线
    '/pipeline/createPipeline': (data) => {
        const newPipeline = {
            id: `pipeline-${String(pipelineIdCounter++).padStart(3, '0')}`,
            name: data?.name || '新流水线',
            description: data?.description || '',
            status: 'success',
            color: data?.color || '#1890ff',
            createTime: new Date().toLocaleString('zh-CN'),
            createUserId: 'mock-user-001',
            pipelinePower: data?.pipelinePower || 1,
            groupId: data?.groupId || null,
            envId: data?.envId || null,
            pipelineFollow: 0,
            ...data
        };
        mockPipelines.unshift(newPipeline);
        console.log('[Mock] 创建流水线:', newPipeline);
        return successResponse(newPipeline);
    },
    
    // 更新流水线
    '/pipeline/updatePipeline': (data) => {
        const index = mockPipelines.findIndex(p => p.id === data?.id);
        if (index !== -1) {
            mockPipelines[index] = { ...mockPipelines[index], ...data };
            console.log('[Mock] 更新流水线:', mockPipelines[index]);
            return successResponse(mockPipelines[index]);
        }
        return successResponse(null);
    },
    
    // 删除流水线
    '/pipeline/deletePipeline': (data) => {
        const index = mockPipelines.findIndex(p => p.id === data?.id);
        if (index !== -1) {
            const deleted = mockPipelines.splice(index, 1);
            console.log('[Mock] 删除流水线:', deleted[0]);
        }
        return successResponse(null);
    },
    
    // 收藏/取消收藏流水线
    '/pipeline/followPipeline': (data) => {
        const pipeline = mockPipelines.find(p => p.id === data?.pipelineId);
        if (pipeline) {
            pipeline.pipelineFollow = pipeline.pipelineFollow === 1 ? 0 : 1;
            console.log('[Mock] 切换收藏状态:', pipeline);
        }
        return successResponse(null);
    },
    
    // 收藏操作（另一个接口）
    '/follow/updateFollow': (data) => {
        const pipeline = mockPipelines.find(p => p.id === data?.pipeline?.id);
        if (pipeline) {
            pipeline.pipelineFollow = pipeline.pipelineFollow === 1 ? 0 : 1;
            console.log('[Mock] 切换收藏状态:', pipeline);
        }
        return successResponse(null);
    },
    
    // 获取所有流水线（未分页）
    '/pipeline/findUserPipeline': () => {
        return successResponse(mockPipelines);
    },
    
    // 获取单个流水线详细信息
    '/pipeline/findPipelineAndQuery': (data) => {
        const formData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        const pipelineId = formData?.pipelineId || data?.pipelineId;
        const pipeline = mockPipelines.find(p => p.id === pipelineId);
        return successResponse(pipeline || mockPipelines[0]);
    },
    
    // 克隆流水线
    '/pipeline/pipelineClone': (data) => {
        const formData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        const pipelineId = formData?.pipelineId || data?.pipelineId;
        const pipelineName = formData?.pipelineName || data?.pipelineName || '克隆的流水线';
        const sourcePipeline = mockPipelines.find(p => p.id === pipelineId);
        if (sourcePipeline) {
            const newPipeline = {
                ...sourcePipeline,
                id: `pipeline-${String(pipelineIdCounter++).padStart(3, '0')}`,
                name: pipelineName,
                createTime: new Date().toLocaleString('zh-CN')
            };
            mockPipelines.unshift(newPipeline);
            console.log('[Mock] 克隆流水线:', newPipeline);
            return successResponse(newPipeline);
        }
        return successResponse(null);
    },
    
    // 获取克隆流水线的默认名称
    '/pipeline/findPipelineCloneName': (data) => {
        const formData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        const pipelineId = formData?.pipelineId || data?.pipelineId;
        const pipeline = mockPipelines.find(p => p.id === pipelineId);
        if (pipeline) {
            return successResponse(`${pipeline.name}-copy`);
        }
        return successResponse('克隆的流水线');
    },
    
    // 导出yaml文件
    '/pipeline/importPipelineYaml': (data) => {
        const formData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        const pipelineId = formData?.pipelineId || data?.pipelineId;
        const pipeline = mockPipelines.find(p => p.id === pipelineId);
        // 返回一个简单的yaml内容
        const yamlContent = `# Pipeline: ${pipeline?.name || 'Unknown'}\nname: ${pipeline?.name || 'Unknown'}\ndescription: ${pipeline?.description || ''}\n`;
        return successResponse(new Blob([yamlContent], { type: 'text/yaml' }));
    },
    
    // 更新最近打开的流水线
    '/open/updateOpen': (data) => {
        console.log('[Mock] 更新最近打开的流水线');
        return successResponse(null);
    },
    
    // 切换流水线
    '/pipeline/findRecentlyPipeline': (data) => {
        const formData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        const number = parseInt(formData?.number || data?.number || 1);
        return successResponse(mockPipelines.slice(0, number));
    },
    
    // 获取流水线项目用户
    '/dmUser/findDmUserPage': (data) => pageResponse([
        { id: 'mock-user-001', name: '管理员', nickname: '管理员', username: 'admin' }
    ], 1),
    
    // 🔑 获取用户在项目中的权限（关键：影响流程设计编辑按钮显示）
    '/dmUser/findDmPermissions': (data) => {
        console.log('[Mock] 获取用户项目权限:', data);
        // ✅ 返回完整的项目权限（与 findDomainPermissions 一致）
        return successResponse([
            "domain_message",
            "domain_message_status",
            "domain_message_user_add",
            "domain_message_user_delete",
            "domain_message_way",
            "domain_role",
            "domain_role_add",
            "domain_role_delete",
            "domain_role_permission_update",
            "domain_role_update",
            "domain_role_update_default",
            "domain_role_user_add",
            "domain_role_user_delete",
            "domain_user",
            "domain_user_add",
            "domain_user_delete",
            "domain_user_update",
            "pip_design",                    // 🔑 流程设计
            "pip_design_run",                // 🔑 流程运行
            "pip_design_timeout",
            "pip_design_update",             // 🔑 流程设计更新（核心权限）
            "pip_design_var_add",
            "pip_design_var_delete",
            "pip_design_var_update",
            "pip_design_webhook",
            "pip_history",
            "pip_history_delete",
            "pip_history_rollback",
            "pip_history_run",
            "pip_setting",
            "pip_setting_clean",
            "pip_setting_clone",
            "pip_setting_delete",
            "pip_setting_export",
            "pip_setting_msg",
            "pip_setting_update",
            "pip_statistics",
            "pip_statistics_overview",
            "pip_statistics_result",
            "pip_statistics_run",
            "pip_test_report",
            "pip_test_report_overview",
            "pip_test_report_overview_find",
            "pip_test_report_sonarqube",
            "pip_test_report_sonarqube_delete",
            "pip_test_report_sonarqube_find",
            "pip_test_report_sonarqube_scan",
            "pip_test_report_sourcefare",
            "pip_test_report_sourcefare_delete",
            "pip_test_report_sourcefare_find",
            "pip_test_report_testhubo",
            "pip_test_report_testhubo_delete",
            "pip_test_report_testhubo_find"
        ]);
    },
    
    // 获取项目用户角色
    '/dmUser/findUserProjectRole': (data) => {
        console.log('[Mock] 获取用户项目角色:', data);
        return successResponse({
            userId: data?.userId || 'mock-user-001',
            domainId: data?.domainId,
            roleId: 'role-admin',
            roleName: '管理员',
            roleType: 1, // 1=管理员
            permissions: [
                "pip_design",
                "pip_design_run",
                "pip_design_timeout",
                "pip_design_update",         // 核心权限
                "pip_design_var_add",
                "pip_design_var_delete",
                "pip_design_var_update",
                "pip_design_webhook",
                "pip_history",
                "pip_history_delete",
                "pip_history_rollback",
                "pip_history_run",
                "pip_setting",
                "pip_setting_clean",
                "pip_setting_clone",
                "pip_setting_delete",
                "pip_setting_export",
                "pip_setting_msg",
                "pip_setting_update",
                "domain_user",
                "domain_role"
            ]
        });
    },
    
    // 项目权限列表（tiklab-privilege-ui）- 使用真实的域权限列表
    '/privilege/findDomainPermissions': (data) => {
        console.log('[Mock] 查找项目域权限:', data);
        // ✅ 使用真实的项目权限数据（来自真实API）
        return successResponse([
            "domain_message",
            "domain_message_status",
            "domain_message_user_add",
            "domain_message_user_delete",
            "domain_message_way",
            "domain_role",
            "domain_role_add",
            "domain_role_delete",
            "domain_role_permission_update",
            "domain_role_update",
            "domain_role_update_default",
            "domain_role_user_add",
            "domain_role_user_delete",
            "domain_user",
            "domain_user_add",
            "domain_user_delete",
            "domain_user_update",
            "pip_design",                    // 🔑 流程设计
            "pip_design_run",                // 🔑 流程运行
            "pip_design_timeout",
            "pip_design_update",             // 🔑 流程设计更新（核心权限）
            "pip_design_var_add",
            "pip_design_var_delete",
            "pip_design_var_update",
            "pip_design_webhook",
            "pip_history",
            "pip_history_delete",
            "pip_history_rollback",
            "pip_history_run",
            "pip_setting",
            "pip_setting_clean",
            "pip_setting_clone",
            "pip_setting_delete",
            "pip_setting_export",
            "pip_setting_msg",
            "pip_setting_update",
            "pip_statistics",
            "pip_statistics_overview",
            "pip_statistics_result",
            "pip_statistics_run",
            "pip_test_report",
            "pip_test_report_overview",
            "pip_test_report_overview_find",
            "pip_test_report_sonarqube",
            "pip_test_report_sonarqube_delete",
            "pip_test_report_sonarqube_find",
            "pip_test_report_sonarqube_scan",
            "pip_test_report_sourcefare",
            "pip_test_report_sourcefare_delete",
            "pip_test_report_sourcefare_find",
            "pip_test_report_testhubo",
            "pip_test_report_testhubo_delete",
            "pip_test_report_testhubo_find"
        ]);
    },
    
    // 获取用户目录
    '/user/userdir/findAllList': () => successResponse([
        { id: 'dir-001', name: 'LDAP', type: 'ldap' }
    ]),
    
    // 更换流水线负责人
    '/pipeline/updatePipelineRootUser': (data) => {
        console.log('[Mock] 更换流水线负责人:', data);
        return successResponse(null);
    },

    // 常用流水线
    '/pipeline/findOpenPage': (data) => {
        const openPipelines = mockPipelines.slice(0, 4).map(pipeline => ({
            pipeline,
            execStatus: {
                successNumber: Math.floor(Math.random() * 50) + 10,
                errorNumber: Math.floor(Math.random() * 10)
            }
        }));
        return pageResponse(openPipelines, openPipelines.length);
    },
    
    // 用户分页查询
    '/user/findUserPage': () => pageResponse([
        { id: 'mock-user-001', name: '管理员', nickname: '管理员', username: 'admin', email: 'admin@test.com' },
        { id: 'mock-user-002', name: '开发者', nickname: '开发者', username: 'developer', email: 'dev@test.com' },
        { id: 'mock-user-003', name: '测试员', nickname: '测试员', username: 'tester', email: 'test@test.com' }
    ], 3),
    
    // 环境管理
    '/env/findEnvList': () => successResponse([
        { id: 'env-001', name: '开发环境', envName: '开发环境', code: 'dev', description: '开发环境' },
        { id: 'env-002', name: '测试环境', envName: '测试环境', code: 'test', description: '测试环境' },
        { id: 'env-003', name: '生产环境', envName: '生产环境', code: 'prod', description: '生产环境' }
    ]),
    
    '/env/findEnvPage': () => pageResponse([
        { id: 'env-001', name: '开发环境', envName: '开发环境', code: 'dev', description: '开发环境' },
        { id: 'env-002', name: '测试环境', envName: '测试环境', code: 'test', description: '测试环境' }
    ], 2),
    
    '/env/createEnv': (data) => {
        console.log('[Mock] 创建环境:', data);
        return successResponse({ id: `env-${Date.now()}`, ...data });
    },
    
    '/env/updateEnv': (data) => {
        console.log('[Mock] 更新环境:', data);
        return successResponse(data);
    },
    
    '/env/deleteEnv': (data) => {
        console.log('[Mock] 删除环境:', data);
        return successResponse(null);
    },

    // 变量管理
    '/pipeline/variable/findVariableList': () => successResponse([
        { id: 'var-001', name: 'API_KEY', value: 'test-key-123', type: 'string' },
        { id: 'var-002', name: 'DB_HOST', value: 'localhost', type: 'string' }
    ]),
    
    '/pipeline/variable/findVariablePage': () => pageResponse([
        { id: 'var-001', name: 'API_KEY', value: 'test-key-123', type: 'string' },
        { id: 'var-002', name: 'DB_HOST', value: 'localhost', type: 'string' }
    ], 2),

    // Agent 管理
    '/agent/findAgentList': () => successResponse([
        { id: 'agent-001', name: 'Agent-1', status: 'online', ip: '192.168.1.100' },
        { id: 'agent-002', name: 'Agent-2', status: 'online', ip: '192.168.1.101' }
    ]),
    
    '/agent/findAgentPage': () => pageResponse([
        { id: 'agent-001', name: 'Agent-1', status: 'online', ip: '192.168.1.100' }
    ], 1),

    // 授权管理
    '/auth/findAuthList': () => successResponse([
        { id: 'auth-001', name: 'GitHub', type: 'github', status: 'active' },
        { id: 'auth-002', name: 'GitLab', type: 'gitlab', status: 'active' }
    ]),

    // 主机管理
    '/host/findHostList': () => successResponse([
        { id: 'host-001', name: 'Server-1', ip: '192.168.1.10', status: 'online' },
        { id: 'host-002', name: 'Server-2', ip: '192.168.1.11', status: 'online' }
    ]),
    
    '/host/findHostPage': () => pageResponse([
        { id: 'host-001', name: 'Server-1', ip: '192.168.1.10', status: 'online' }
    ], 1),

    // 服务器配置
    '/authServer/findAuthServerList': () => successResponse([
        { id: 'server-001', name: 'Jenkins', type: 'jenkins', url: 'http://jenkins.local' },
        { id: 'server-002', name: 'GitLab', type: 'gitlab', url: 'http://gitlab.local' }
    ]),
    
    '/authServer/findAuthServerPage': () => pageResponse([
        { id: 'server-001', name: 'Jenkins', type: 'jenkins', url: 'http://jenkins.local' }
    ], 1),

    // 工具管理
    '/tool/findToolList': () => successResponse([
        { id: 'tool-001', name: 'Maven', type: 'maven', version: '3.8.1' },
        { id: 'tool-002', name: 'Node.js', type: 'nodejs', version: '20.19.0' }
    ]),

    // K8s 配置
    '/k8s/findK8sList': () => successResponse([
        { id: 'k8s-001', name: 'K8s-Cluster-1', apiServer: 'https://k8s.local:6443' }
    ]),

    // 用户管理
    '/user/findUserPage': () => pageResponse([
        { id: 'user-001', name: '管理员', username: 'admin', email: 'admin@test.com' },
        { id: 'user-002', name: '开发者', username: 'developer', email: 'dev@test.com' }
    ], 2),
    
    '/user/findUserList': () => successResponse([
        { id: 'user-001', name: '管理员', username: 'admin' },
        { id: 'user-002', name: '开发者', username: 'developer' }
    ]),

    // 角色权限
    '/systemRole/findRoleList': () => successResponse([
        { id: 'role-001', name: '管理员', code: 'admin' },
        { id: 'role-002', name: '开发者', code: 'developer' }
    ]),
    
    '/systemRole/getSystemPermissions': (userId) => {
        console.log('[Mock] 获取用户权限:', userId);
        return successResponse({
            // 返回所有权限，让用户可以访问所有功能
            permissions: [
                'pipeline_create', 'pipeline_edit', 'pipeline_delete', 'pipeline_view',
                'setting_view', 'setting_edit',
                'user_manage', 'role_manage',
                'admin'
            ],
            roles: ['admin']
        });
    },
    
    // 权限验证（总是返回true）
    '/privilege/validPrivilege': () => successResponse(true),
    
    // 获取用户权限列表（tiklab-privilege-ui 需要）- 使用真实的权限列表
    '/permission/findPermissions': (data) => {
        console.log('[Mock] 获取全局权限列表:', data);
        // ✅ 使用真实的权限数据（来自真实API）
        return successResponse([
            "application",
            "apply_limits",
            "apply_limits_add_user",
            "apply_limits_close_user",
            "apply_limits_delete_user",
            "apply_limits_open_user",
            "backups_and_recover",
            "backups_create",
            "backups_update_status",
            "custom_logo",
            "custom_logo_update_pic",
            "custom_logo_update_status",
            "custom_logo_update_title",
            "ip_whitelist",
            "ip_whitelist_black",
            "ip_whitelist_white",
            "licence",
            "licence_import",
            "log",
            "message",
            "message_plan_delete",
            "message_plan_user_add",
            "message_update_plan_send_way",
            "message_update_plan_status",
            "message_update_send_way",
            "openapi",
            "openapi_add",
            "openapi_delete",
            "orga",
            "orga_add_orga",
            "orga_add_user",
            "orga_delete_orga",
            "orga_delete_user",
            "orga_update_orga",
            "permission",
            "permission_role_add",
            "permission_role_delete",
            "permission_role_permission_update",
            "permission_role_update",
            "permission_role_update_default",
            "permission_role_user_add",
            "permission_role_user_delete",
            "pipeline",
            "pipeline_agent",
            "pipeline_agent_add",
            "pipeline_agent_delete",
            "pipeline_agent_update",
            "pipeline_application",
            "pipeline_create",
            "pipeline_create_application",
            "pipeline_delete_application",
            "pipeline_environment",
            "pipeline_environment_add",
            "pipeline_environment_delete",
            "pipeline_environment_update",
            "pipeline_host",
            "pipeline_host_add",
            "pipeline_host_delete",
            "pipeline_host_group",
            "pipeline_host_group_add",
            "pipeline_host_group_delete",
            "pipeline_host_group_update",
            "pipeline_host_update",
            "pipeline_kubernetes_cluster",
            "pipeline_kubernetes_cluster_add",
            "pipeline_kubernetes_cluster_delete",
            "pipeline_kubernetes_cluster_update",
            "pipeline_overview_statistics",
            "pipeline_release",
            "pipeline_release_add",
            "pipeline_release_delete",
            "pipeline_release_update",
            "pipeline_resource_monitor",
            "pipeline_resource_update",
            "pipeline_result_statistics",
            "pipeline_run_statistics",
            "pipeline_service_integration",
            "pipeline_service_integration_add",
            "pipeline_service_integration_delete",
            "pipeline_service_integration_update",
            "pipeline_statistics",
            "pipeline_tool_integration",
            "pipeline_tool_integration_add",
            "pipeline_tool_integration_delete",
            "pipeline_tool_integration_update",
            "pipeline_update_application",
            "pipeline_variable",
            "pipeline_variable_add",
            "pipeline_variable_delete",
            "pipeline_variable_update",
            "recover_create",
            "user",
            "user_add_group",
            "user_add_group_user",
            "user_add_user",
            "user_delete_group",
            "user_delete_group_user",
            "user_delete_user",
            "user_dir",
            "user_dir_config",
            "user_dir_forbid",
            "user_dir_open",
            "user_dir_sync",
            "user_group",
            "user_update_group",
            "user_update_user",
            "user_update_user_password",
            "user_update_user_recover"
        ]);
    },

    // 消息通知
    '/message/findMessageList': () => successResponse([
        { id: 'msg-001', title: '系统通知', content: '欢迎使用 Arbess', time: '2024-01-01 10:00:00' }
    ]),
    
    '/message/findUnreadCount': () => successResponse({ count: 0 }),
    
    // 消息项分页查询（站内信）
    '/message/messageItem/findMessageItemPage': (data) => {
        console.log('[Mock] 查询消息项:', data);
        return pageResponse([
            {
                id: 'msg-item-001',
                title: '欢迎使用 Arbess',
                content: '这是一个测试消息',
                status: 0,
                sendTime: new Date().toLocaleString('zh-CN')
            }
        ], 1);
    },
    
    // 应用链接列表（顶部应用切换）
    '/appLink/findAppLinkList': () => {
        console.log('[Mock] 查询应用链接列表');
        return successResponse([
            {
                id: 'app-001',
                name: 'Arbess',
                code: 'arbess',
                url: '/',
                icon: '/arbess.png'
            }
        ]);
    },

    // 历史记录
    '/history/findHistoryPage': () => pageResponse([
        { 
            id: 'history-001', 
            pipelineName: '测试流水线1',
            status: 'success',
            startTime: '2024-01-01 10:00:00',
            endTime: '2024-01-01 10:05:00',
            duration: 300
        }
    ], 1),

    // 测试报告
    '/test/findTestOverview': () => successResponse({
        totalTests: 100,
        passedTests: 95,
        failedTests: 5,
        coverage: 85.5
    }),

    // 分组管理
    '/grouping/findGroupingList': () => successResponse([
        { id: 'group-001', name: '前端应用', groupName: '前端应用', description: '前端应用分组' },
        { id: 'group-002', name: '后端服务', groupName: '后端服务', description: '后端服务分组' }
    ]),
    
    '/grouping/findGroupList': () => successResponse([
        { id: 'group-001', name: '前端应用', groupName: '前端应用', description: '前端应用分组' },
        { id: 'group-002', name: '后端服务', groupName: '后端服务', description: '后端服务分组' }
    ]),
    
    '/group/findGroupList': () => successResponse([
        { id: 'group-001', name: '前端应用', groupName: '前端应用', description: '前端应用分组' },
        { id: 'group-002', name: '后端服务', groupName: '后端服务', description: '后端服务分组' }
    ]),
    
    '/group/findGroupPage': (data) => pageResponse([
        { id: 'group-001', name: '前端应用', groupName: '前端应用', description: '前端应用分组' },
        { id: 'group-002', name: '后端服务', groupName: '后端服务', description: '后端服务分组' }
    ], 2),
    
    '/group/createGroup': (data) => {
        console.log('[Mock] 创建应用分组:', data);
        return successResponse({ id: `group-${Date.now()}`, ...data });
    },
    
    '/group/updateGroup': (data) => {
        console.log('[Mock] 更新应用分组:', data);
        return successResponse(data);
    },
    
    '/group/deleteGroup': (data) => {
        console.log('[Mock] 删除应用分组:', data);
        return successResponse(null);
    },

    // 资源统计
    '/resources/findResourceOverview': () => successResponse({
        cpu: { used: 40, total: 100 },
        memory: { used: 60, total: 128 },
        disk: { used: 200, total: 500 }
    }),

    // OpenAPI
    '/openApi/findOpenApiList': () => successResponse([
        { id: 'api-001', name: 'Pipeline API', path: '/api/v1/pipeline' }
    ]),

    // 组织架构
    '/orga/findOrgaList': () => successResponse([
        { id: 'org-001', name: '技术部', parentId: null },
        { id: 'org-002', name: '开发组', parentId: 'org-001' }
    ]),

    // 用户组
    '/userGroup/findUserGroupPage': () => pageResponse([
        { id: 'group-001', name: '开发组', memberCount: 10 }
    ], 1),

    // 目录管理
    '/directory/findDirectoryList': () => successResponse([
        { id: 'dir-001', name: 'LDAP', type: 'ldap', status: 'active' }
    ]),

    // 备份恢复
    '/backup/findBackupList': () => successResponse([
        { id: 'backup-001', name: '备份-20240101', time: '2024-01-01 00:00:00', size: '1.2GB' }
    ]),

    // 版本信息
    '/version/getVersion': () => successResponse({
        version: '1.0.0',
        buildTime: '2024-01-01',
        edition: 'Community Edition'
    }),

    // 授权信息
    '/productAuth/getProductAuth': () => successResponse({
        product: 'Arbess',
        edition: 'CE',
        expireTime: '2025-12-31',
        status: 'active'
    }),

    // 动态/动态消息
    '/dynamic/findDynamicPage': () => pageResponse([
        {
            id: 'dyna-001',
            type: 'pipeline',
            title: '流水线执行完成',
            content: '流水线 "测试流水线1" 执行成功',
            time: '2024-01-01 10:00:00'
        }
    ], 1),

    // 概览数据
    '/overview/findOverview': () => successResponse({
        totalPipelines: 10,
        runningPipelines: 2,
        successPipelines: 7,
        failedPipelines: 1,
        todayExecutions: 15
    }),
    
    // 初始化安装状态（tiklab-eam-ui 需要）
    '/init/install/findStatus': () => {
        // 返回 status: 'success' 才会渲染应用
        return {
            code: 0,
            msg: 'success',
            data: {
                status: 'success',        // 🔑 关键：必须是 'success' 才会渲染应用
                installStatus: true,      // true 表示已安装
                initStatus: true,         // true 表示已初始化
                serviceStatus: 'running', // 服务运行中
                message: '系统已就绪',     // 显示的消息
                plan: 100                 // 进度 100%
            }
        };
    },
    
    // 系统版本检查
    '/system/version/findVersion': () => successResponse({
        version: '1.0.0',
        versionStatus: 'latest'
    }),
    
    // ==================== 流程设计相关 ====================
    
    // 查询流水线的所有任务（流程设计核心接口）
    '/tasks/finAllTask': (data) => {
        const formData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        const pipelineId = formData?.pipelineId || data?.pipelineId;
        console.log('[Mock] 查询流水线任务:', pipelineId);
        
        // 返回一个示例任务列表（空列表表示新建流水线）
        return successResponse([
            // 示例：代码拉取任务
            {
                taskId: 'task-001',
                taskName: '代码拉取',
                taskType: 'code',
                taskSort: 1,
                pipelineId: pipelineId,
                taskStatus: 1,
                taskInstance: {
                    codeType: 'git',
                    authId: 'auth-001',
                    address: 'https://github.com/example/repo.git',
                    branch: 'main'
                }
            },
            // 示例：构建任务
            {
                taskId: 'task-002',
                taskName: '项目构建',
                taskType: 'build',
                taskSort: 2,
                pipelineId: pipelineId,
                taskStatus: 1,
                taskInstance: {
                    buildType: 'maven',
                    command: 'clean package',
                    jdkVersion: '1.8'
                }
            }
        ]);
    },
    
    // 查询流水线的所有阶段（🔄 支持动态增删改）
    '/stage/finAllStage': (data) => {
        const formData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        const pipelineId = formData?.pipelineId || data?.pipelineId;
        console.log('[Mock] 🔍 查询流水线阶段:', pipelineId);
        
        // 确保流水线有数据
        const pipelineData = ensurePipelineData(pipelineId);
        
        console.log('[Mock] ✅ 返回阶段列表，共', pipelineData.stages.length, '个阶段');
        return successResponse(pipelineData.stages);
    },
    
    // 旧的静态数据保留作为备注
    '/stage/finAllStageV2': (data) => {
        const formData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        const pipelineId = formData?.pipelineId || data?.pipelineId;
        return successResponse([
            {
                stageId: "stage-001",
                stageName: "源码",
                createTime: new Date().toLocaleString('zh-CN'),
                pipelineId: pipelineId,
                stageSort: 1,
                parentId: null,
                code: true,  // 源码阶段特殊标记
                taskValues: null,
                stageList: [
                    {
                        stageId: "stage-001-1",
                        stageName: "源码",
                        createTime: new Date().toLocaleString('zh-CN'),
                        pipelineId: null,
                        stageSort: 1,
                        parentId: "stage-001",
                        code: false,
                        taskValues: [
                            {
                                taskId: "task-001",
                                createTime: new Date().toLocaleString('zh-CN'),
                                taskType: "git",
                                taskSort: 1,
                                taskName: "通用Git",
                                pipelineId: null,
                                postprocessId: null,
                                stageId: "stage-001-1",
                                task: null,
                                instanceId: null,
                                taskVariable: null,
                                fieldStatus: 1
                            }
                        ],
                        stageList: null,
                        taskType: null,
                        taskName: null,
                        taskId: null,
                        values: null,
                        taskSort: 0,
                        parallelName: null,
                        instanceId: null,
                        mainStageId: null
                    }
                ],
                taskType: null,
                taskName: null,
                taskId: null,
                values: null,
                taskSort: 0,
                parallelName: null,
                instanceId: null,
                mainStageId: null
            },
            {
                stageId: "stage-002",
                stageName: "构建",
                createTime: new Date().toLocaleString('zh-CN'),
                pipelineId: pipelineId,
                stageSort: 2,
                parentId: null,
                code: false,
                taskValues: null,
                stageList: [
                    {
                        stageId: "stage-002-1",
                        stageName: "并行阶段-2-1",
                        createTime: new Date().toLocaleString('zh-CN'),
                        pipelineId: null,
                        stageSort: 1,
                        parentId: "stage-002",
                        code: false,
                        taskValues: [
                            {
                                taskId: "task-002",
                                createTime: new Date().toLocaleString('zh-CN'),
                                taskType: "maven",
                                taskSort: 1,
                                taskName: "Maven构建",
                                pipelineId: null,
                                postprocessId: null,
                                stageId: "stage-002-1",
                                task: null,
                                instanceId: null,
                                taskVariable: null,
                                fieldStatus: 1
                            }
                        ],
                        stageList: null,
                        taskType: null,
                        taskName: null,
                        taskId: null,
                        values: null,
                        taskSort: 0,
                        parallelName: null,
                        instanceId: null,
                        mainStageId: null
                    }
                ],
                taskType: null,
                taskName: null,
                taskId: null,
                values: null,
                taskSort: 0,
                parallelName: null,
                instanceId: null,
                mainStageId: null
            },
            {
                stageId: "stage-003",
                stageName: "部署",
                createTime: new Date().toLocaleString('zh-CN'),
                pipelineId: pipelineId,
                stageSort: 3,
                parentId: null,
                code: false,
                taskValues: null,
                stageList: [
                    {
                        stageId: "stage-003-1",
                        stageName: "并行阶段-3-1",
                        createTime: new Date().toLocaleString('zh-CN'),
                        pipelineId: null,
                        stageSort: 1,
                        parentId: "stage-003",
                        code: false,
                        taskValues: [
                            {
                                taskId: "task-003",
                                createTime: new Date().toLocaleString('zh-CN'),
                                taskType: "liunx",
                                taskSort: 1,
                                taskName: "主机部署",
                                pipelineId: null,
                                postprocessId: null,
                                stageId: "stage-003-1",
                                task: null,
                                instanceId: null,
                                taskVariable: null,
                                fieldStatus: 1
                            }
                        ],
                        stageList: null,
                        taskType: null,
                        taskName: null,
                        taskId: null,
                        values: null,
                        taskSort: 0,
                        parallelName: null,
                        instanceId: null,
                        mainStageId: null
                    }
                ],
                taskType: null,
                taskName: null,
                taskId: null,
                values: null,
                taskSort: 0,
                parallelName: null,
                instanceId: null,
                mainStageId: null
            }
        ]);
    },
    
    // 查询YAML格式的任务
    '/tasks/finYamlTask': (data) => {
        const formData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        const pipelineId = formData?.pipelineId || data?.pipelineId;
        console.log('[Mock] 查询YAML任务:', pipelineId);
        return successResponse('# Pipeline YAML\nname: example\nstages:\n  - build\n  - test');
    },
    
    // 查询YAML格式的阶段
    '/stage/findStageYaml': (data) => {
        const formData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        const pipelineId = formData?.pipelineId || data?.pipelineId;
        console.log('[Mock] 查询YAML阶段:', pipelineId);
        return successResponse('stages:\n  - name: build\n  - name: deploy');
    },
    
    // 创建任务（🔄 支持动态添加）
    '/tasks/createTask': (data) => {
        console.log('[Mock] 🆕 创建任务:', data);
        
        const pipelineId = data?.pipelineId;
        const stageId = data?.stageId;
        const taskType = data?.taskType || 'git';
        const taskName = data?.taskName || '新任务';
        
        // 生成新任务ID
        const newTaskId = `task-${Date.now()}-${taskIdCounter++}`;
        
        const newTask = {
            taskId: newTaskId,
            createTime: new Date().toLocaleString('zh-CN'),
            taskType: taskType,
            taskSort: data?.taskSort || 1,
            taskName: taskName,
            pipelineId: null,
            postprocessId: null,
            stageId: stageId,
            task: null,
            instanceId: null,
            taskVariable: null,
            fieldStatus: 1,
            ...data
        };
        
        // 如果有 pipelineId 和 stageId，添加到对应的阶段
        if (pipelineId && stageId) {
            const pipelineData = ensurePipelineData(pipelineId);
            const added = addTaskToStage(pipelineData.stages, stageId, newTask);
            if (added) {
                console.log('[Mock] ✅ 任务创建成功:', newTaskId, taskName);
            } else {
                console.log('[Mock] ⚠️ 未找到阶段:', stageId, '任务创建在内存中但未关联');
            }
        }
        
        return successResponse(newTask);
    },
    
    // 更新任务（🔄 支持动态更新）
    '/tasks/updateTask': (data) => {
        console.log('[Mock] 🔄 更新任务:', data);
        
        const taskId = data?.taskId;
        const pipelineId = data?.pipelineId;
        
        if (pipelineId && taskId) {
            const pipelineData = ensurePipelineData(pipelineId);
            const updated = updateTaskInStage(pipelineData.stages, taskId, data);
            if (updated) {
                console.log('[Mock] ✅ 任务更新成功:', taskId);
            } else {
                console.log('[Mock] ⚠️ 未找到任务:', taskId);
            }
        }
        
        return successResponse(data);
    },
    
    // 删除任务（🔄 支持动态删除）
    '/tasks/deleteTask': (data) => {
        const formData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        const taskId = formData?.taskId || data?.taskId;
        const pipelineId = formData?.pipelineId || data?.pipelineId;
        
        console.log('[Mock] 🗑️ 删除任务:', taskId, 'pipelineId:', pipelineId);
        
        if (pipelineId && taskId) {
            const pipelineData = ensurePipelineData(pipelineId);
            const deleted = deleteTaskFromStage(pipelineData.stages, taskId);
            if (deleted) {
                console.log('[Mock] ✅ 任务删除成功:', taskId);
            } else {
                console.log('[Mock] ⚠️ 未找到任务:', taskId);
            }
        }
        
        return successResponse(null);
    },
    
    // 查询单个任务（根据不同的任务类型返回不同的配置）
    '/tasks/findOneTasksOrTask': (data) => {
        const formData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        const taskId = formData?.taskId || data?.taskId;
        const taskType = formData?.taskType || data?.taskType || 'git';
        
        console.log('[Mock] 查询单个任务:', taskId, 'taskType:', taskType);
        
        // 不同任务类型的配置模板
        const taskTemplates = {
            // Git 代码拉取
            'git': {
                taskId: taskId || 'task-git-001',
                createTime: '2024-11-05 15:13:53',
                taskType: 'git',
                taskSort: 1,
                taskName: '通用Git',
                pipelineId: null,
                postprocessId: null,
                stageId: formData?.stageId || data?.stageId,
                task: {
                    taskId: taskId || 'task-git-001',
                    codeType: 'git',
                    authId: 'auth-001',
                    address: 'https://github.com/example/repo.git',
                    branch: 'main',
                    sort: 0,
                    type: null,
                    instanceId: null
                },
                instanceId: null,
                taskVariable: null,
                fieldStatus: 1
            },
            
            // Maven 构建
            'maven': {
                taskId: taskId || 'task-maven-001',
                createTime: '2024-11-05 15:13:53',
                taskType: 'maven',
                taskSort: 1,
                taskName: 'Maven构建',
                pipelineId: null,
                postprocessId: null,
                stageId: formData?.stageId || data?.stageId,
                task: {
                    taskId: taskId || 'task-maven-001',
                    buildAddress: '${DEFAULT_CODE_ADDRESS}',
                    buildOrder: 'clean package',
                    productRule: null,
                    dockerName: null,
                    dockerVersion: 'latest',
                    dockerFile: null,
                    dockerOrder: null,
                    sort: 0,
                    type: null,
                    instanceId: null,
                    toolJdk: null,
                    toolMaven: null,
                    toolNodejs: null,
                    toolGo: null,
                    toolOther: null
                },
                instanceId: null,
                taskVariable: null,
                fieldStatus: 1
            },
            
            // Gradle 构建
            'build_gradle': {
                taskId: taskId || 'task-gradle-001',
                createTime: '2024-11-05 15:13:53',
                taskType: 'build_gradle',
                taskSort: 1,
                taskName: 'Gradle构建',
                pipelineId: null,
                postprocessId: null,
                stageId: formData?.stageId || data?.stageId,
                task: {
                    taskId: taskId || 'task-gradle-001',
                    buildAddress: '${DEFAULT_CODE_ADDRESS}',
                    buildOrder: 'gradle build ',
                    productRule: null,
                    dockerName: null,
                    dockerVersion: 'latest',
                    dockerFile: null,
                    dockerOrder: null,
                    sort: 0,
                    type: null,
                    instanceId: null,
                    toolJdk: null,
                    toolMaven: null,
                    toolNodejs: null,
                    toolGo: null,
                    toolOther: null
                },
                instanceId: null,
                taskVariable: null,
                fieldStatus: 1
            },
            
            // Docker 构建
            'docker': {
                taskId: taskId || 'task-docker-001',
                createTime: '2024-11-05 15:13:53',
                taskType: 'docker',
                taskSort: 1,
                taskName: 'Docker构建',
                pipelineId: null,
                postprocessId: null,
                stageId: formData?.stageId || data?.stageId,
                task: {
                    taskId: taskId || 'task-docker-001',
                    buildAddress: '${DEFAULT_CODE_ADDRESS}',
                    dockerName: 'my-app',
                    dockerVersion: 'latest',
                    dockerFile: 'Dockerfile',
                    dockerOrder: 'docker build -t my-app:latest .',
                    authId: 'auth-001',
                    sort: 0,
                    type: null,
                    instanceId: null
                },
                instanceId: null,
                taskVariable: null,
                fieldStatus: 1
            },
            
            // Linux 主机部署
            'liunx': {
                taskId: taskId || 'task-liunx-001',
                createTime: '2024-11-05 15:13:53',
                taskType: 'liunx',
                taskSort: 1,
                taskName: '主机部署',
                pipelineId: null,
                postprocessId: null,
                stageId: formData?.stageId || data?.stageId,
                task: {
                    taskId: taskId || 'task-liunx-001',
                    hostId: 'host-001',
                    authId: 'auth-001',
                    deployPath: '/opt/app',
                    deployOrder: 'bash deploy.sh',
                    sort: 0,
                    type: null,
                    instanceId: null
                },
                instanceId: null,
                taskVariable: null,
                fieldStatus: 1
            },
            
            // 代码扫描 SpotBugs
            'spotbugs': {
                taskId: taskId || 'task-spotbugs-001',
                createTime: '2024-11-05 15:13:53',
                taskType: 'spotbugs',
                taskSort: 1,
                taskName: 'Java代码扫描',
                pipelineId: null,
                postprocessId: null,
                stageId: formData?.stageId || data?.stageId,
                task: {
                    taskId: taskId || 'task-spotbugs-001',
                    buildAddress: '${DEFAULT_CODE_ADDRESS}',
                    scanPath: 'src/main/java',
                    sort: 0,
                    type: null,
                    instanceId: null
                },
                instanceId: null,
                taskVariable: null,
                fieldStatus: 1
            }
        };
        
        // 返回对应类型的模板，如果没有则返回默认的 git 模板
        const template = taskTemplates[taskType] || taskTemplates['git'];
        
        return successResponse({
            ...template,
            taskId: taskId || template.taskId,
            stageId: formData?.stageId || data?.stageId || template.stageId
        });
    },
    
    // 查询任务必填字段
    '/tasks/findTasksMustField': (data) => {
        console.log('[Mock] 查询任务必填字段:', data);
        return successResponse([]);
    },
    
    // 更新任务必填字段
    '/tasks/updateTasksMustField': (data) => {
        console.log('[Mock] 更新任务必填字段:', data);
        return successResponse(null);
    },
    
    // 验证阶段必填字段
    '/stage/validStagesMustField': (data) => {
        const formData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        console.log('[Mock] 验证阶段必填字段:', data);
        return successResponse([]);
    },
    
    // 创建阶段（🔄 支持动态添加）
    '/stage/createStage': (data) => {
        console.log('[Mock] 🆕 创建阶段/任务 (根据入参判断):', data);
        
        const pipelineId = data?.pipelineId;
        const stageSort = data?.stageSort || 1;
        const stageIdForTask = data?.stageId; // 如果传入了 stageId，说明是在现有并行阶段下添加任务（串行/并行）
        
        // 情况 A：带 stageId → 实际是添加任务到现有子阶段
        if (pipelineId && stageIdForTask) {
            const taskType = data?.taskType || 'git';
            const taskName = data?.taskName || '新任务';
            const newTaskId = `task-${Date.now()}-${taskIdCounter++}`;
            const newTask = {
                taskId: newTaskId,
                createTime: new Date().toLocaleString('zh-CN'),
                taskType: taskType,
                taskSort: data?.taskSort || 1,
                taskName: taskName,
                pipelineId: null,
                postprocessId: null,
                stageId: stageIdForTask,
                task: null,
                instanceId: null,
                taskVariable: null,
                fieldStatus: 1,
                ...data
            };
            const pipelineData = ensurePipelineData(pipelineId);
            // 1) 优先尝试将任务添加到已存在的子阶段（stageIdForTask 作为子阶段ID）
            let added = addTaskToStage(pipelineData.stages, stageIdForTask, newTask);
            if (added) {
                console.log('[Mock] ✅ 在子阶段下添加任务成功:', stageIdForTask, newTaskId);
                return successResponse(newTaskId);
            }
            // 2) 如果未找到，认为传入的是父阶段ID，需要创建一个新的并行子阶段，再把任务放进去
            for (let stage of pipelineData.stages) {
                if (stage.stageId === stageIdForTask) {
                    const newSubStageId = `stage-${Date.now()}-${stageIdCounter++}-p`;
                    const newSubStage = {
                        stageId: newSubStageId,
                        stageName: `并行阶段-${stage.stageSort}-${(stage.stageList?.length || 0) + 1}`,
                        createTime: new Date().toLocaleString('zh-CN'),
                        pipelineId: null,
                        stageSort: (stage.stageList?.length || 0) + 1,
                        parentId: stage.stageId,
                        code: false,
                        taskValues: [],
                        stageList: null,
                        taskType: null,
                        taskName: null,
                        taskId: null,
                        values: null,
                        taskSort: 0,
                        parallelName: null,
                        instanceId: null,
                        mainStageId: null
                    };
                    if (!stage.stageList) stage.stageList = [];
                    stage.stageList.push(newSubStage);
                    // 将任务添加到新创建的并行子阶段
                    added = addTaskToStage(pipelineData.stages, newSubStageId, newTask);
                    console.log('[Mock] ✅ 创建并行子阶段并添加任务:', newSubStageId, newTaskId);
                    return successResponse(newTaskId);
                }
            }
            console.log('[Mock] ⚠️ 未找到目标阶段（既不是子阶段也不是父阶段）:', stageIdForTask);
            return successResponse(newTaskId);
        }
        
        // 情况 B：不带 stageId → 创建新的阶段（“添加新任务”按钮）
        const stageName = data?.stageName || '新阶段';
        const newStageId = `stage-${Date.now()}-${stageIdCounter++}`;
        const newSubStageId = `stage-${Date.now()}-${stageIdCounter++}-1`;
        
        const newStage = {
            stageId: newStageId,
            stageName: stageName,
            createTime: new Date().toLocaleString('zh-CN'),
            pipelineId: pipelineId,
            stageSort: stageSort,
            parentId: null,
            code: false,
            taskValues: null,
            stageList: [
                {
                    stageId: newSubStageId,
                    stageName: `并行阶段-${stageSort}-1`,
                    createTime: new Date().toLocaleString('zh-CN'),
                    pipelineId: null,
                    stageSort: 1,
                    parentId: newStageId,
                    code: false,
                    taskValues: [],
                    stageList: null,
                    taskType: null,
                    taskName: null,
                    taskId: null,
                    values: null,
                    taskSort: 0,
                    parallelName: null,
                    instanceId: null,
                    mainStageId: null
                }
            ],
            taskType: null,
            taskName: null,
            taskId: null,
            values: null,
            taskSort: 0,
            parallelName: null,
            instanceId: null,
            mainStageId: null,
            ...data
        };
        
        // 如果用户在创建新阶段时已经选择了任务类型，则直接在新建的并行子阶段中添加该任务
        let createdTaskId = null;
        if (data?.taskType) {
            const newTaskId = `task-${Date.now()}-${taskIdCounter++}`;
            const taskType = data?.taskType;
            const taskName = data?.taskName || '新任务';
            const newTask = {
                taskId: newTaskId,
                createTime: new Date().toLocaleString('zh-CN'),
                taskType: taskType,
                taskSort: data?.taskSort || 1,
                taskName: taskName,
                pipelineId: null,
                postprocessId: null,
                stageId: newSubStageId,
                task: null,
                instanceId: null,
                taskVariable: null,
                fieldStatus: 1,
                ...data
            };
            // 放入新建子阶段
            if (newStage.stageList && newStage.stageList[0]) {
                if (!newStage.stageList[0].taskValues) newStage.stageList[0].taskValues = [];
                newStage.stageList[0].taskValues.push(newTask);
                createdTaskId = newTaskId;
            }
        }

        if (pipelineId) {
            const pipelineData = ensurePipelineData(pipelineId);
            pipelineData.stages.splice(Math.max(0, stageSort - 1), 0, newStage);
            console.log('[Mock] ✅ 阶段创建成功 (插入位置:', stageSort, '):', newStageId, stageName);
        }
        
        // 若创建阶段时同时创建了任务，则返回 taskId 以便前端打开表单；否则返回阶段对象
        if (createdTaskId) {
            return successResponse(createdTaskId);
        }
        return successResponse(newStage);
    },
    
    // 更新阶段（🔄 支持动态更新）
    '/stage/updateStage': (data) => {
        console.log('[Mock] 🔄 更新阶段:', data);
        
        const stageId = data?.stageId;
        const pipelineId = data?.pipelineId;
        
        if (pipelineId && stageId) {
            const pipelineData = ensurePipelineData(pipelineId);
            // 查找并更新阶段
            for (let i = 0; i < pipelineData.stages.length; i++) {
                if (pipelineData.stages[i].stageId === stageId) {
                    pipelineData.stages[i] = {
                        ...pipelineData.stages[i],
                        ...data
                    };
                    console.log('[Mock] ✅ 阶段更新成功:', stageId);
                    break;
                }
            }
        }
        
        return successResponse(data);
    },

    // 更新阶段名称（兼容前端单独的名称更新接口）
    '/stage/updateStageName': (data) => {
        console.log('[Mock] 🔄 更新阶段名称:', data);
        const stageId = data?.stageId;
        const pipelineId = data?.pipelineId;
        const stageName = data?.stageName || data?.name;
        if (pipelineId && stageId && stageName) {
            const pipelineData = ensurePipelineData(pipelineId);
            for (let i = 0; i < pipelineData.stages.length; i++) {
                if (pipelineData.stages[i].stageId === stageId) {
                    pipelineData.stages[i].stageName = stageName;
                    console.log('[Mock] ✅ 阶段名称已更新:', stageId, '=>', stageName);
                    break;
                }
            }
            return successResponse(null);
        }
        // 兼容：如果没有传 pipelineId，则在所有流水线中查找该 stageId
        if (!pipelineId && stageId && stageName) {
            for (const pid of Object.keys(pipelineDesignData)) {
                const p = ensurePipelineData(pid);
                for (let i = 0; i < p.stages.length; i++) {
                    if (p.stages[i].stageId === stageId) {
                        p.stages[i].stageName = stageName;
                        console.log('[Mock] ✅ 阶段名称已更新(全局查找):', stageId, '=>', stageName);
                        return successResponse(null);
                    }
                }
            }
        }
        return successResponse(null);
    },
    
    // 删除阶段（🔄 支持动态删除）
    '/stage/deleteStage': (data) => {
        const formData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        const stageId = formData?.stageId || data?.stageId;
        const pipelineId = formData?.pipelineId || data?.pipelineId;
        const maybeTaskOrStageId = formData?.taskId || data?.taskId; // 前端可能传 taskId 字段
        
        console.log('[Mock] 🗑️ 删除阶段:', stageId || maybeTaskOrStageId, 'pipelineId:', pipelineId);
        
        if (pipelineId && stageId) {
            const pipelineData = ensurePipelineData(pipelineId);
            // 查找并删除阶段
            const index = pipelineData.stages.findIndex(s => s.stageId === stageId);
            if (index !== -1) {
                pipelineData.stages.splice(index, 1);
                console.log('[Mock] ✅ 阶段删除成功:', stageId);
            } else {
                console.log('[Mock] ⚠️ 未找到阶段:', stageId);
            }
        } else if (pipelineId && maybeTaskOrStageId) {
            const pipelineData = ensurePipelineData(pipelineId);
            // 先尝试将 taskId 作为阶段ID删除
            let index = pipelineData.stages.findIndex(s => s.stageId === maybeTaskOrStageId);
            if (index !== -1) {
                pipelineData.stages.splice(index, 1);
                console.log('[Mock] ✅ 阶段删除成功(通过taskId字段识别为stageId):', maybeTaskOrStageId);
            } else {
                // 否则尝试查找包含该任务的父阶段并整体删除父阶段
                for (let i = 0; i < pipelineData.stages.length; i++) {
                    const stage = pipelineData.stages[i];
                    if (!stage.stageList) continue;
                    for (let sub of stage.stageList) {
                        if (sub.taskValues && sub.taskValues.some(t => t.taskId === maybeTaskOrStageId)) {
                            pipelineData.stages.splice(i, 1);
                            console.log('[Mock] ✅ 删除包含任务的整段阶段:', stage.stageId, '任务:', maybeTaskOrStageId);
                            return successResponse(null);
                        }
                    }
                }
                console.log('[Mock] ⚠️ 未找到与 taskId 相关的阶段:', maybeTaskOrStageId);
            }
        }
        
        return successResponse(null);
    },
    
    // 查询单个阶段
    '/stage/findOneStage': (data) => {
        console.log('[Mock] 查询单个阶段:', data);
        return successResponse({
            stageId: data?.stageId,
            stageName: '示例阶段',
            stageSort: 1
        });
    },
    
    // 创建阶段组或任务
    '/stage/createStagesGroupOrTask': (data) => {
        console.log('[Mock] 创建阶段组或任务:', data);
        return successResponse({
            id: `group-${Date.now()}`,
            ...data
        });
    },
    
    // 查询授权列表（代码拉取需要）
    '/auth/findAuthList': () => successResponse([
        { id: 'auth-001', name: 'GitHub', type: 'github', status: 'active' },
        { id: 'auth-002', name: 'GitLab', type: 'gitlab', status: 'active' }
    ]),
    
    // 查询工具列表（构建需要）
    '/tool/findToolList': () => successResponse([
        { id: 'tool-001', name: 'Maven', type: 'maven', version: '3.8.1' },
        { id: 'tool-002', name: 'Node.js', type: 'nodejs', version: '20.19.0' },
        { id: 'tool-003', name: 'JDK', type: 'jdk', version: '1.8' }
    ]),
    
    // 查询流水线统计（设计页面需要）
    '/pipeline/findPipelineCount': (pipelineId) => {
        console.log('[Mock] 查询流水线统计:', pipelineId);
        return successResponse({
            taskCount: 2,
            stageCount: 0,
            execCount: 5,
            successCount: 4,
            failCount: 1
        });
    },
};

/**
 * 获取 Mock 数据
 * @param url 请求的 URL
 * @param data 请求参数
 * @returns Mock 数据
 */
export const getMockData = (url, data) => {
    console.log('[Mock] 拦截请求:', url, 'NODE_ENV:', process.env.NODE_ENV, data);
    
    // 处理 FormData（如果 InitMock 没有处理）
    let processedData = data;
    if (data instanceof FormData) {
        processedData = {};
        for (let [key, value] of data.entries()) {
            processedData[key] = value;
        }
        console.log('[Mock] FormData 已转换:', processedData);
    }
    
    // 精确匹配
    if (mockDataMap[url]) {
        return mockDataMap[url](processedData);
    }
    
    // 模糊匹配 - 创建操作
    if (url.includes('/create')) {
        return successResponse({ 
            id: 'mock-' + Date.now(), 
            ...processedData,
            createTime: new Date().toLocaleString('zh-CN')
        });
    }
    
    // 模糊匹配 - 更新操作
    if (url.includes('/update')) {
        return successResponse({ 
            ...processedData,
            updateTime: new Date().toLocaleString('zh-CN')
        });
    }
    
    // 模糊匹配 - 删除操作
    if (url.includes('/delete')) {
        console.log('[Mock] 删除操作:', processedData);
        return successResponse(null);
    }
    
    // 模糊匹配 - 查询操作
    if (url.includes('/find') && url.includes('Page')) {
        return pageResponse([], 0);
    }
    
    if (url.includes('/find') && url.includes('List')) {
        return successResponse([]);
    }
    
    if (url.includes('/get')) {
        return successResponse({});
    }
    
    // 默认返回成功
    console.log('[Mock] 未找到匹配的 Mock 数据，返回默认成功响应');
    return successResponse(null);
};

export default mockDataMap;
