import React from 'react'
import ErrorPage from 'biz-nebula-ui/lib/error-page'
import Router from '../../utils/router'
/**
 * 404页面
 */
export default function(){
    return <ErrorPage status="404" onClick={backHome} />
}

function backHome(){
    Router.push('/');
}