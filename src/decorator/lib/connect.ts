import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {AnyAction} from 'redux';


function connectDecorator(namespace?: string | Array<string>, actions?: AnyAction): any {
    const provideDispatch = dispatch => bindActionCreators(actions, dispatch);
    const matchDispatchToProps = !actions ? actions : provideDispatch;

    const matchPropsToState = (state) => {
        let namespaces = namespace instanceof Array ? [].concat(namespace) : [namespace];
        if (namespaces.length) {
            let _props = {};
            namespaces.forEach(item => {
                if (state[item]) {
                    _props[item] = _props[item] ? Object.assign({}, _props[item], state[item]) : state[item]
                }
            });
            return _props;
        } else {
            return state;
        }
    }

    return connect(matchPropsToState, matchDispatchToProps, null, { withRef: true });
}

export default connectDecorator;
