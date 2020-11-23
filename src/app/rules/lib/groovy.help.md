所有注入到spring当中的bean，都可以通过ctx.getBean("bean名称")的方式获取。

ctx 即是 applicationContext.

此外，userService，roleService，positionService，organizationService 等常用权限管理service，redisMutexService 生成全局唯一值service, 可直接获取

例如 def userA = userService.findByAccount("A账户") .

在事件监听器中可直接使用delegateExecution对象，在任务监听器中可直接使用delegateTask对象
例如 delegateExecution.setVariable("a", 1)
    delegateTask.setVariable("b", 2)
