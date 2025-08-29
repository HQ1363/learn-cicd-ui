/**
 * @Description: 流水线测试导航
 * @Author: gaomengyuan
 * @Date:
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/3/12
 */
import React from 'react';
import PipelineSetAside from "../../../common/component/aside/PipelineSetAside";

const Test = (props) => {

    const {match} = props

    const pipelineId = match.params.id;

    const projectRouters = [
        {
            id:`/pipeline/${pipelineId}/test/overview`,
            title: '概况',
            purviewCode: 'pip_test_report_overview_find',
        },
        {
            id: 'scan',
            title: '代码扫描',
            children: [
                {
                    id: `/pipeline/${pipelineId}/test/sonar`,
                    title: 'SonarQube',
                    purviewCode: 'pip_test_report_sonarqube_find',
                },
                {
                    id: `/pipeline/${pipelineId}/test/sourceFare`,
                    title: 'SourceFare',
                    purviewCode: 'pip_test_report_sourcefare_find',
                }
            ]
        },
        {
            id: 'automated',
            title: '自动化测试',
            children: [
                {
                    id: `/pipeline/${pipelineId}/test/testHubo`,
                    title: 'TestHubo',
                    purviewCode: 'pip_test_report_testhubo_find',
                }
            ]
        },
    ]

    return (
        <PipelineSetAside
            {...props}
            domainId={pipelineId}
            projectRouters={projectRouters}
            outerPath={`/pipeline/${pipelineId}/test`}
            asideTitle={'测试报告'}
        >
        </PipelineSetAside>
    )
}

export default Test
