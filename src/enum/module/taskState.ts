import EnumDecorator,{EnumBase} from 'biz-nebula-ui/lib/_decorator/enumDecorator'

/**
 * 此文件只是一个示例文件，没有实际用途
 * EnumBase 是nebula枚举的基类  此基类有对应的 便捷API
 * by justin 2019-10-15
 */
@EnumDecorator.mapping
export default class TaskState extends EnumBase{
    /**
     * 正常状态
     * label为枚举的表示 
     * key 为枚举的key  value为枚举的真实值
     */
    @EnumDecorator.label('未完成')
    Finishing = 1

    /**
     * 发病状态
     * label为枚举的表示 
     * key 为枚举的key  value为枚举的真实值
     */
    @EnumDecorator.label('已完成')
    Finished = 2
}
