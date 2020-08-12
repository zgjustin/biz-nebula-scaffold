import TaskState from './module/taskState'

/**
 * 枚举模块集合
 * 此文件为枚举的总入口
 * by justin 2019-10-15
 */
class EnumEntity {
  /**
   * 任务状态
   */
  TaskState = new TaskState()
}

export default new EnumEntity();
