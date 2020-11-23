import React,{ PureComponent } from 'react';
import { Table } from 'biz-nebula-ui';
import RestFul from '../../restful'

export default class RuleList extends PureComponent<any,any>{

    list: any = null;

    constructor(props) {
        super(props);
        this.state = {
            selectedRow: null
        }
    }

    taskPromise = () => {
        return RestFul.GetApiPromise(RestFul.Rules.FindRulesALL, {});
    }

    getOperation() {
        return []
    }

    handleSelection = (data, selectedRows) => {
        let id = data && data.length ? data[0] : '';
        if(id !== "") {
            this.setState({
                selectedRow:selectedRows[0]
            });
        }
    }

    getDetail = (row) => {
        RestFul.GetApiPromise(RestFul.Rules.findDetailsByCodeAndVersion, {
            code:row.code,
            version: row.cverion
        }).then(function(data) {
            console.log("data>>>",JSON.stringify(data));
        });
    }

    process = (row) => {
        RestFul.GetApiPromise(RestFul.Rules.processDefinitions, {
            code:row.code,
            version: row.cverion,
            customerCode: 'CM000084',
            productCode: 'B023895',
            startTime: '2020-07-01 00:00:00',
            endTime: '2020-07-31 23:59:59'
        }).then(function(data) {
            console.log("data>>>",data);
        });
    }

    render () {
        const columns = [{
            title: "规则名称",
            name: "name"
        },{
            title: "规则编码",
            name: "code"
        }, {
            title: "版本",
            name: "cverion"
        }, {
            title: "返回参数",
            name: "returnParam"
        }, {
            title: "描述",
            name: "desc"
        }]

        const opts = this.getOperation();

        return (
            <>
                <Table
                    pagination = {false}
                    footer={false}
                    columns = {columns}
                    autoHeight={true}
                    promise = {this.taskPromise}
                    buttons = {opts}
                    ref={node => this.list = node}
                />
            </>
        )
    }
}
