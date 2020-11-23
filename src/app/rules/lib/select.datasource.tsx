import React from 'react';
import { Modal, Tooltip } from "antd";
import { Table } from 'biz-nebula-ui';
import RestFul from "@/restful";


function EllipsisText(text) {
    return (
        <Tooltip title={text}>
            <span
                className="engine-text-ellipsis"
                style={{
                    width: "100%"
                }}
            >
                {text}
            </span>
        </Tooltip>
    )
}

const columns = [
    {
        key: 0,
        title: "服务源名称",
        name: "name",
        width: 200,
        render: text => EllipsisText(text)
    },
    {
        key: 1,
        title: '方法描述',
        name: 'description',
        render: text => EllipsisText(text)
    },
    {
        key: 2,
        title: '方法简称',
        name: 'simpleMethodName',
        render: text => EllipsisText(text)
    },
    {
        key: 3,
        title: '方法名称',
        name: 'methodName',
        render: text => EllipsisText(text)
    },
    {
        key: 4,
        title: '返回类名称',
        name: 'returnClassName',
        render: text => EllipsisText(text)
    },
];

const paramsArr = [
    {
        name: "name",
        label: "服务源名称",
        placeholder: "请输入服务源名称",
        control: "input"
    },
    {
        name: "description",
        label: "方法描述",
        placeholder: "请输入方法描述",
        control: "input"
    },
    {
        name: "simpleMethodName",
        label: "方法简称",
        placeholder: "请输入方法简称",
        control: "input"
    },
];



class DataSourceList extends React.Component<any,any>{
    serviceList:any = null;

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            btnloading: false,
            selectedRow: null
        }
    }

    show = () => {
        this.setState({
            visible: true
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            btnloading: false
        })
    }

    taskPromise = (searchData) => {
        return RestFul.GetApiPromise(RestFul.Nebula2.FindServiceDataSourceList, {
            usedScope: "READ",
            isAuth: false,
            size: 1000,
            ...searchData
        });
    }

    handleOk = () => {
        const { onChange } = this.props;
        const { selectedRow } = this.state;
        if (!selectedRow) return;
        this.setState({
            visible:false
        },() => {
            onChange && onChange(selectedRow)
        });
    }

    handleSelection = (data, selectedRows) => {
        let id = data && data.length ? data[0] : '';
        if(id !== "") {
            this.setState({
                selectedRow:selectedRows[0]
            });
        }
    }

    render() {
        const {
            selectedRow,
            btnloading,
            visible
        } = this.state;


        return <>
            <Modal
                visible={ visible }
                onCancel={ this.handleCancel }
                onOk={ this.handleOk }
                okButtonProps={{
                    loading: btnloading
                }}
                width="1200px"
                title="服务源选择"
                style={{
                    top: "20px"
                }}
            >
                <Table
                    pagination = {true}
                    maxHeight={250}
                    autoHeight={false}
                    searchItem={paramsArr}
                    searchButtonShow={true}
                    rowKey='name'
                    columns = {columns}
                    promise = {this.taskPromise}
                    rowSelectionType = {2}
                    rowSelectionChange = {this.handleSelection}
                    ref={node => this.serviceList = node}
                />
            </Modal>
        </>
    }
}

export default DataSourceList;
