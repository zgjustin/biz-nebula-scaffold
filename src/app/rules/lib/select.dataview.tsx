import React, { PureComponent } from 'react';
import { Modal, Spin, Select, Tree, Radio, message, Icon} from 'antd';
import { connect } from '../../../decorator';
import { FormGroup, FormItem } from 'biz-nebula-ui';

const { Option } = Select;
const { TreeNode } = Tree;


@connect('rules')
export default class SelectDataView extends PureComponent<any,any> {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSourceList: [],
            dataViewList: [],
            loading: false,
            selectDataView: '',
            curDataSource: '', //当前选择的DataSource
        };
        this.showModal = this.showModal.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.getDataAuthList = this.getDataAuthList.bind(this);
    }

    async showModal(dataview) {
        let { dataSource } = dataview || {};
        let curDataSource = dataSource ? dataSource.id : '';
        this.setState(
            {
                visible: true,
                loading: true,
                selectDataView: dataview,
                curDataSource,
            },
            () => {
                //获取数据源列表
                this.props
                    .dispatch({
                        type: 'rules/getDataSourceList',
                        curDataSource,
                    })
                    .then(() => {
                        this.setState({
                            loading: false,
                        });
                    });
            }
        );
    }

    componentWillReceiveProps(nextProps) {
        let { dataSourceList, dataViewList } = nextProps.rules;
        this.setState({
            dataSourceList: dataSourceList || [],
            dataViewList: dataViewList || []
        });
    }


    //设置选中的数据权限(单选，只能选1条)
    setSelectDataAuth = ( dataview, dataViewCode ) => {
        this.setState({
            selectDataView: dataview,
            dataViewCode
        });
    }

    generateAuthTree = ( childrenObj, selectDataView) => {
        let AuthDom = [];
        if(childrenObj.type !== 'dataView'){
            let list = [];
            if( childrenObj.children && childrenObj.children instanceof Array ){
                for ( let item of childrenObj.children ) {
                    list.push(this.generateAuthTree( item, selectDataView ));
                }
                AuthDom.push(
                    <TreeNode selectable = {false} title = {childrenObj.title} key = {childrenObj.id} icon ={<Icon  type="folder-add"></Icon>}>
                        {list}
                    </TreeNode>
                )
            }else{
                AuthDom.push(
                    <TreeNode selectable = {false} title = {childrenObj.title} key = {childrenObj.id}
                              icon = {() => <Icon  type="folder" />}
                    >
                    </TreeNode>
                )
            }
        }else{
            let _code = selectDataView && selectDataView.code ? selectDataView.code : '';
                AuthDom.push(
                <TreeNode selectable = { false } title = {
                    <>
                        <Radio
                            onChange = {() => this.setSelectDataAuth(childrenObj,_code)}
                            value = {_code}
                        >
                            <> <Icon  type="file" />{childrenObj.name}</>
                        </Radio>
                    </>
                }
                          key = {childrenObj.id}

                />

            )

        }
        return AuthDom;
    }

    //获取数据权限树形结构
    getDataAuthList() {
        let { dataViewList, selectDataView } = this.state;
        console.log(selectDataView);
        return (
            <Tree
                checkable = {false}
                showIcon = {true}
                showLine = {false}
            >
                {dataViewList.map((item, k) => {
                    return(
                        <TreeNode selectable = {false} title = {item.groupName} key = {k} icon ={<Icon type="folder-add"></Icon>}>
                            { item.children &&
                            item.children.length &&
                            item.children.map((cv, ck) => {
                                    return this.generateAuthTree( cv, selectDataView );
                                }
                            )}
                        </TreeNode>
                    );
                })}
            </Tree>
        );
    }

    //设置选中的数据视图(单选，只能选1条)
    setSelectDataView(dataView) {
        this.setState({
            selectDataView: dataView,
        });
    }

    onCancel() {
        this.setState({
            visible: false,
        });
    }

    //点击确认提交事件
    onOk() {
        let { selectDataView } = this.state;
        if (!selectDataView) {
            message.warning('当前没有选择任何数据视图，请确认！');
            return;
        }
        this.setState(
            {
                visible: false,
            },
            () => this.props.setSelectDataView(selectDataView.code)
        );
    }

    findDetailsByDataSourceId() {
        let { curDataSource } = this.state;
        this.props
            .dispatch({
                type: 'rules/findDetailsByDataSource',
                dataSourceId: curDataSource,
            })
            .then(() => {
                this.setState({
                    loading: false,
                });
            });
    }

    //改变选择的数据源
    changeDataSource = (value) => {
        if (value === 'main') {
            value = '';
        }
        this.setState(
            {
                curDataSource: value,
            },
            () => this.findDetailsByDataSourceId()
        );
    }

    render() {
        let { visible, loading, dataSourceList, curDataSource } = this.state;

        console.log("dataSourceList>>",dataSourceList);
        return (
            <Modal
                title="选择数据视图"
                visible={visible}
                width={600}
                okText="确认"
                cancelText="取消"
                onCancel={() => this.onCancel()}
                onOk={() => this.onOk()}
                destroyOnClose
            >
                <Spin spinning={loading}>
                    <FormGroup>
                        <FormItem
                            label="请选择数据源"
                            name="dataSource"
                            value={curDataSource || 'main'}
                        >
                            <Select
                                onChange={value => this.changeDataSource(value)}
                                style={{ width: '150px' }}
                            >
                                <Option value="main">主数据源</Option>
                                {dataSourceList.map((v, k) => {
                                    return (
                                        <Option key={k} value={v.id} disabled={v.tstatus === 0}>
                                            {v.code}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </FormItem>
                    </FormGroup>
                    <div style={{ height: '20rem', overflowY: 'auto' }}>
                        {this.getDataAuthList()}
                    </div>
                </Spin>
            </Modal>
        );
    }
}
