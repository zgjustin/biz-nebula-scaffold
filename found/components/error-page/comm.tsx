import React from 'react'
import ErrorPage from 'nebula-ui/lib/error-page'
import Router from '../../utils/router'

/**
 * 错误页面属性
 */
interface ErrorPageProps {
    /**
     * 错误状态码
     */
    status:string|number
    /**
     * 错误说明
     */
    title?:string
}

/**
 * 通用错误页面
 */
export default function(props:ErrorPageProps){
    let {status,title} = props;
    status = `${status}`;
    return <ErrorPage status={status||'404'} subTitle={title} onClick={backHome} />
}

function backHome(){
    Router.push('/');
}