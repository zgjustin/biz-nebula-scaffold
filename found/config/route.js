/* 
 * path: // 用于进行比对的路径
 * app: // 当前的模块名称
 * module： 
 */
 const routes = [
    {
        path: '/codeRule',
        app:"account"
    },
    {   
        path: '/buttonAuthorityManage',
        app:"account"
    },
    {
        path: '/envVariable',
        app:"account"
    },
    {
        path: '/menuAuthorityManage',
        app:"account"
    },
    {
        path: '/themeManage',
        app:"account"
    },
    {
        path: '/organizationManagement',
        app:"account"
    },
    {
        path: '/positionManagement',
        app:"account"
    },
    {
        path: '/roleManagement',
        app:"account"
    },
    {
        path: '/scheduler',
        app:"account"
    },
    {
        path: '/accountManagement',
        app:"account"
    },
    {
        path: '/usersGroupManagement',
        app:"account"
    },
    {
        path: '/roleRelation',
        app:"account"
    },
    {
        path: '/markdown',
        app:"doc"
    },
    {
        path: '/dataviewsourcemanage/manage',
        app:"datasource"
    },
    {
        path: '/serviceSource',
        app:"datasource"
    },
    {
        path: '/dataviewsourcemanage',
        app:"datasource"
    },
    {
        path: '/remoteServiceAddressManage',
        app:"datasource"
    },
    {
        path: '/datasourcemanage',
        app:"datasource"
    },
    {
        path: '/enum',
        app:"datasource"
    },
    {
        path: '/dataAuth/manage',
        app:"datasource"
    },
    {
        path: '/remoteservicemanage',
        app:"datasource"
    },
    {
        path: '/dataAuth',
        app:"datasource"
    },
    {
        path: '/listTemplate',
        app:"page"
    },
    {
        path: '/listTemplate/setting',
        app:"page"
    },
    {
        path: '/listTemplate/browser',
        app:"page"
    },
    {
        path: '/pageflow',
        app:"page"
    },
    {
        path: '/pageInstance',
        app:"page"
    },
    {
        path: '/template',
        app:"page"
    },
    {
        path: '/template/modal',
        app:"page"
    },
    {
        path: '/template/dynamicTemplate',
        app:"page"
    },
    {
        path: '/engineList',
        app:"page"
    },
    {
        path: '/engineOutList',
        app:"page"
    },
    {
        path: '/custom',
        app:"page"
    },
    {
        path:'/listCustomPage',
        app:'page'
    },
    {
        path: '/dataTableManage',
        app: "datasource"
    },
    {
        path: '/func',
        app:"page"
    },
    {
        path: '/instance',
        app:"page"
    },
    {
        path: "/instance/changeLog",
        app: "page"
    },
    {
        path: '/instance/activity/form',
        app:"page"
    },
    {
        path: '/listOpenInstance',
        app:"page"
    },
    {
        path: '/preview',
        app:"page"
    },
    {
        path: '/build',
        app:"page"
    },
    {
        path: '/build.html',
        app:"page"
    },
    {
        path: '/main',
        app:"page"
    },
    {
        path: '/main.html',
        app:"page"
    },
    {
        path: '/list',
        app:"page"
    },
    {
        path: '/listInstance',
        app:"page"
    },
    {
        path: '/instance/activity',
        app:"page"
    },
    {
        path: '/migration/basic/import',
        app:"datasource"
    },
    {
        path: "/flow/flowcontrol",
        app: "flow"
    },
    {
        path: "/flow/flowcontrol/edit",
        app: "flow"
    },
    {
        path: "/flow/flowcontrol/inspection",
        app: "flow"
    },
    {
        path: "/flow/flowcontrol/detail",
        app: "flow"
    },
    {
        path: "/flow/flowInstance",
        app: "flow"
    },
    {
        path: "/flow/flowInstance/detail",
        app: "flow"
    },
    {
        path: "/flow/flowInstance/list",
        app: "flow"
    },
    {
        path: "/flow/flowInstance/copy",
        app: "flow"
    },
    {
        path: "/flow/flowInstance/waiting",
        app: "flow"
    },
    {
        path: "/flow/flowInstance/done",
        app: "flow"
    },
    {
        path: "/flow/flowInstance/launchBySelf",
        app: "flow"
    },
    {
        path: "/flow/flowInstance/useableFlowTemp",
        app: "flow"
    },
    {
        path: "/flow/operation",
        app: "flow"
    },
    {
        path: "/flow/monitor",
        app: "flow"
    },
    {
        path:'/flowmain',
        app:"page"
    },
    {
        path:'/listChangeLog',
        app:"page"
    },
    {
        path: "/ruleTemplate",
        module: "rules",
        app:'rules',
        framework:false
      },
      {
        path: "/rulelist",
        module: "rules",
        app:'rules'
        
      },
      {
        path: "/rule/definitions",
        module: "rules",
        app:'rules'
      },
      {
        path: "/demo-user-filter",
        module: "rules",
        app:'rules',
        framework:false
      },
    {
        path:'/',
        app:''
    }
];
export default routes;