import React,{ PureComponent } from 'react'
import { Table, Select } from 'biz-nebula-ui';
import RestFul from '../../restful'
import { NodeType } from './lib/rule'
import AddGroup from './lib/add.group'
import connect from "@/decorator/lib/connect";

@connect('rules')
export default class NodeList extends PureComponent<any,any>{

    addGroup: any = null;
    grouplist: any = null;

    constructor(props) {
        super(props);

        this.state = {
            visible:false
        }
    }

    taskPromise  = (params) => {
        //groupType
        return RestFul.GetApiPromise(RestFul.Rules.findByGroupStatus, {
            ...params
        })
    }


    getOperation() {
        return [
            {
                name: 'primary',
                text: '新增分组',
                onClick: e => {
                    this.addGroup && this.addGroup.wrappedInstance.visibleModal();
                }
            }
        ]
    }

    onSave () {
        this.grouplist && this.grouplist.refreshData();
    }

    render () {
        const columns = [{
            title: "分组名称",
            name: "name"
        }, {
            title: "分组编码",
            name: "code"
        }, {
            title: "分组类型",
            name: "type",
            render: (type,row) => NodeType[type] ? NodeType[type] : ''
        }, {
            title: "分组状态",
            name: "groupStatus",
            render: (status,row) => status == "0" ? '禁用' : '启用'
        }]

        const paramsArr = [
            {
                name: "groupStatus",
                label: "状态",
                control: Select,
                haveAllOpt: true,
                defaultValue: '',
                options: [{
                    label:"全部",
                    value: ""
                }, {
                    label:"启用",
                    value: 1
                }, {
                    label:"禁用",
                    value: 0
                }]
            }
        ];

        const opts = this.getOperation();

        return (
            <>
                <Table
                    pagination = {false}
                    footer={false}
                    columns = {columns}
                    searchItem={paramsArr}
                    searchButtonShow={true}
                    promise = {this.taskPromise}
                    buttons = {opts}
                    autoHeight={true}
                    ref={group => this.grouplist = group}
                />
                <AddGroup wrappedComponentRef={self => this.addGroup = self}  onSaveCallback={this.onSave}/>
            </>
        )
    }
}
