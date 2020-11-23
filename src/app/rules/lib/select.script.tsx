import React,{ PureComponent } from 'react';
import { Table } from 'biz-nebula-ui';
import RestFul from '../../../restful'
import {Input, message, Modal, Icon} from "antd"
import AddScript from './add.script'

const paramsArr = [
    {
        name: "name",
        label: "脚本名称",
        control: "input"
    }
];

export default class ScriptList extends PureComponent<any,any>{

    list: any = null;
    updateForm: any = null;

    constructor(props) {
        super(props);
        this.state = {
            selectedRow: props.data || null,
            visible: false,
            isShow: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data !== this.state.selectedRow) {
            this.setState({
                isShow:true,
                selectedRow:nextProps.data
            });
        }
    }

    taskPromise = (params) => {
        return RestFul.GetApiPromise(RestFul.Nebula2.ScriptList, {
            language: "groovy",
            name: params.name || ""
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


    handleOk = () => {
        const { selectedRow } = this.state;
        if(selectedRow) {
            this.setState({
                isShow:true,
                visible:false
            },() => {
                this.props.onChange && this.props.onChange(selectedRow);
            });
        }else {
            message.info("请选择脚本！");
        }
    }

    saveScript = () => {
        this.updateForm && this.updateForm.wrappedInstance.handleSubmit();
    }

    onChangeScript = (data) => {
        this.setState({
            selectedRow:data
        }, () => {
            this.props.onChange && this.props.onChange(data);
        });
    }

    visibleModal = () => {
        this.setState({
            visible:!this.state.visible
        });
    }

    render () {
        const columns = [{
            title: "脚本名称",
            name: "name"
        }, {
            title: "描述",
            name: "description"
        }]
        const { visible, isShow, selectedRow }  = this.state;
        return (
            <>
                <div className="params-more">
                    <Input
                        readOnly
                        value={selectedRow && selectedRow.name ? selectedRow.name : ""}
                        style={{ cursor: "pointer" }}
                        onClick={this.visibleModal}
                        placeholder="请选择groovy脚本"
                        addonAfter={<Icon type="setting" />}
                    />
                    <span className="more" onClick={() => {
                        this.setState({
                            isShow:!this.state.isShow
                        });
                    }}>
                        {isShow && (<span><Icon type="up" />折叠</span>)}
                        {!isShow && (<span><Icon type="down" />展开</span>)}
                    </span>

                    <span className="add" onClick={() => {
                            this.setState({
                                selectedRow: null,
                                isShow:true
                            }, () => {
                                this.props.onChange && this.props.onChange(null);
                            });
                        }}>
                        <Icon type="plus-circle" />
                        新增
                    </span>

                    {isShow && (
                        <span className="save" onClick={this.saveScript} >
                            <Icon type="form" />
                            保存
                        </span>
                    )}
                </div>
                <Modal
                    visible={ visible }
                    onCancel={ this.visibleModal }
                    onOk={ this.handleOk }
                    width="1200px"
                    title="脚本选择"
                    style={{
                        top: "20px"
                    }}
                >
                    <Table
                        searchItem={paramsArr}
                        searchButtonShow={true}
                        pagination = {false}
                        columns = {columns}
                        promise = {this.taskPromise}
                        rowSelectionType = {2}
                        rowSelectionChange = {this.handleSelection}
                        maxHeight={this.state.tableMaxHeight}
                        ref={node => this.list = node}
                    />
                </Modal>
                {isShow && (
                    <AddScript
                        wrappedComponentRef={ self => this.updateForm = self}
                        data={selectedRow}
                        onChange={this.onChangeScript}
                    />
                )}

            </>
        )
    }
}
