import React,{ PureComponent } from 'react';
import RestFul from '../../restful'
import { getParams } from 'utils/urlParam';
import { NodeType, HandType } from './lib/rule';
import { Table, Select } from 'biz-nebula-ui';
import {message, Button, Dropdown, Menu} from "antd";
import connect from "@/decorator/lib/connect";

@connect('rules')
export default class NodeList extends PureComponent<any,any>{

    nodelist: any = null;
    rule: any = null;
    wrap: any = null;

    constructor(props) {
        super(props);

        let urlParam = getParams(window.location.href);

        this.state = {
            code: urlParam.code || "",
            cverion: urlParam.cverion || "",
            selectedRow: [],
            selectedRowKeys: [],
            grouplist: [],
            // templateGroup: "" //全部
        }
    }

    componentDidMount() {
        this.props.dispatch({
            type:"rules/getGroupsList",
            data: {
                groupStatus:1
            },
            callback: (data) => {
                if(data) {
                    this.setState({
                        grouplist: data
                    });
                }
            }
        });
    }

    taskPromise  = (params) => {
        const { templateGroup } = this.state;
        return RestFul.GetApiPromise(RestFul.Rules.findByTemplateGroupAndStatusAndType, {
            ...params
        });
    }

    getMenuOpration = (id) => {
        let { selectedRowKeys } = this.state;
        selectedRowKeys = selectedRowKeys.filter(item => typeof item !== "undefined");

        if(selectedRowKeys.length == 0 )  {
            message.info("请先选一条数据！");
            return
        }
        this.props.dispatch({
            type:"rules/movesToGroup",
            data: {
                templateGroupId:id,
                templateNodeIds:selectedRowKeys
            },
            callback: (data) => {
                if(data) {
                    message.success("移至分组成功");
                    this.nodelist && this.nodelist.refreshData();
                }
            }
        });
    }

    removeGourp = (id,groupId) => {
        this.props.dispatch({
            type:"rules/removeToGroup",
            data: {
                templateGroupId:groupId,
                templateNodeIds:id
            },
            callback: (data) => {
                if(data) {
                    message.success("移除分组成功");
                    this.nodelist && this.nodelist.refreshData();
                }
            }
        });
    }

    getContentMenu = () => {
        let { grouplist } = this.state;
        return (
            <Menu>
                {grouplist && grouplist.map((group) => {
                    return (
                        <Menu.Item key={group.id} onClick={() => this.getMenuOpration(group.id)}>
                            {group.name}
                        </Menu.Item>
                    )
                })}

            </Menu>
        )
    }

    getOperation() {
        return [
            {
                name: 'primary',
                text: '新增节点',
                onClick: e => {
                    this.props.history.push(`/rule/setting`);

                }
            },
            {
                name: 'primary',
                render: () => {
                    return (
                        <Dropdown overlay={this.getContentMenu()}>
                            <Button
                                type="primary"
                                onClick={e => e.preventDefault()}
                            >
                                批量移至分组
                            </Button>
                        </Dropdown>
                    )
                }

            }
        ]
    }

    handleSelection = (keys, selectedRows) => {
        this.setState({
            selectedRowKeys: keys,
            selectedRow:selectedRows
        });
    }

    editNode = (id) => {
        this.props.history.push(`/rule/setting?id=${id}`);
    }

    getGroupList = () => {
        const { grouplist } = this.state;

        let options = [{
            label:"全部",
            value: ""
        }]

        //分组列表
        grouplist && grouplist.forEach(item => {
            options.push({
                label:item.name,
                value:item.id
            });
        });

        return options;
    }

    getNodeType = () => {
        let options = [{
            label:"全部",
            value: ""
        }]

        Object.entries(NodeType).map(([key,value]) => {
            options.push({
                label:value,
                value:key
            });
        })

        return options;
    }

    render () {
        const columns = [
        {
            title: "所属分组",
            name: "templateGroup",
            render: (group,row) => group && group.name ? group.name : ''
        },
        {
            title: "节点编码",
            name: "code"
        }, {
            title: "节点名称",
            name: "name"
        },{
            title: "节点类型",
            name: "type",
            render: (type,row) => NodeType[type] ? NodeType[type] : ''
        }, {
            title: "处理器类型",
            name: "sourceType",
            render: (type,row) => HandType[type] ? HandType[type] : ''
        }]

        const opts = this.getOperation();

        const paramsArr = [
            {
                name: "templateGroup",
                label: "分组",
                control: Select,
                haveAllOpt: true,
                defaultValue: '',
                options: this.getGroupList()
            },
            {
                name: "type",
                label: "类型",
                control: Select,
                haveAllOpt: true,
                defaultValue: '',
                options: this.getNodeType()
            }
        ];

        const columnButton = [
            {
                text: '编辑',
                name: 'edit',
                showText: true,
                onClick: (record, _v) => {
                    this.editNode(record.id)
                },
            },
            {
                text: '移除分组',
                name: 'view',
                showText: true,
                hasPermission: (record, index) => {
                    if(record.templateGroup) {
                        return true
                    }else {
                        return false
                    }
                },
                onClick: (record, _v) => {
                    this.removeGourp(record.id,record.templateGroup.id)
                }
            }
        ];

        return (
            <div className="roles-node-list" ref={self => this.wrap = self}>
                <Table
                    pagination = {false}
                    footer={false}
                    columnBtn={columnButton}
                    columns = {columns}
                    searchItem={paramsArr}
                    searchButtonShow={true}
                    promise = {this.taskPromise}
                    buttons = {opts}
                    autoHeight={true}
                    rowSelectionType = {3}
                    rowSelectionChange = {this.handleSelection}
                    ref={node => this.nodelist = node}
                />
            </div>
        )
    }
}
