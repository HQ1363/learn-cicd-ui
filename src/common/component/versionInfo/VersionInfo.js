/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/7/7
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/7/7
 */
import React from "react";
import "./VersionInfo.scss";


const VersionInfo = (props) => {

    return (
        <div className='tiklab-version-info'>
            <div>
                © 2020-2025 tiklab.net 版权所有
            </div>
            <div className='tiklab-version-info-bottom'>
                <a
                    href={'https://www.gnu.org/licenses/gpl-3.0.txt'}
                    target={'_blank'}
                >
                    GPL v3
                </a>
                <span>·</span>
                <a
                    href={'https://developer.tiklab.net/'}
                    target={'_blank'}
                >
                    社区
                </a>
                <span>·</span>
                <a
                    href={'https://doc.tiklab.net'}
                    target={'_blank'}
                >
                    文档
                </a>
                <span>·</span>
                <a
                    href={'https://tiklab.net/aboutus'}
                    target={'_blank'}
                >
                    关于我们
                </a>
            </div>
        </div>
    )

}


export default VersionInfo
