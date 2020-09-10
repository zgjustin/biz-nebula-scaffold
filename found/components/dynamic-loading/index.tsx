import React,{PureComponent} from 'react'
import ReactDOM from 'react-dom'
import Spin from 'biz-nebula-ui/lib/spin'
import './style/index.less'
/**
 * 动态页面 加载状态组件
 * 假进度条
 * by justin 2019-4-22
 */
class DynamicLoading extends PureComponent<any,any> {
    constructor(props) {
      super(props);
      this.state = {
        percentage: 5,
        isComplate: false,
        start:false
      };
      this.timer = null;
      
      this._plusProgress = this._plusProgress.bind(this);
      this.complete = this.complete.bind(this);
    }
    timer:any
    //自动增加进度条百分比
    _plusProgress() {
      let { percentage } = this.state;
      if (percentage === 95) {
        this._clearTimer();
        return;
      }
      this.setState({
        percentage: this.state.percentage + 5,
      });
    }
    //清空计时器
    _clearTimer() {
      clearInterval(this.timer);
    }
    //组件加载完成
    complete() {
      this._clearTimer();
      this.setState({ percentage: 100 });
      setTimeout(() => {
        this.setState({ isComplate: true });
      }, 50);
    }
    componentWillReceiveProps(nextprops){
        if(nextprops.isComplate===false){
            this.setState({ percentage: 0 }); 
            this.timer = setInterval(this._plusProgress, 100);
        }
    }
    componentDidMount() {
      //计时器进入假进度条的加载
      this.setState({start:true});
      this.timer = setInterval(this._plusProgress, 100);
    }
    render() {
      let { percentage,start } = this.state;
      let {isComplate} = this.props;
      if(isComplate){
        this._clearTimer();
      }
      return <React.Fragment>
        <LoadingProcess isComplate={isComplate} start={start} percentage={percentage} />
        <Spin className='nebula-loading' spinning={!isComplate}>
          {this.props.children}
        </Spin>
      </React.Fragment>
    }
}

const loadProcessContainerId = 'nebula_load_process'
/**
 * 页面加载假进度条
 * @param props 
 */
function LoadingProcess(props){
  let {isComplate,percentage,start} = props;
  if(!start) return null;
  let loadProcessContainer = document.getElementById(loadProcessContainerId);
  if(!loadProcessContainer){
    loadProcessContainer = document.createElement('div');
    loadProcessContainer.setAttribute('id',loadProcessContainerId);
    document.body.appendChild(loadProcessContainer);
  }
  let processDom = <div className="nebula-progress" style={{ display: `${isComplate ? 'none' : 'block'}` }}>
    <span className="nebula-progress-current" style={{ width: percentage + '%' }}/>
  </div>
  return ReactDOM.createPortal(processDom,loadProcessContainer);
}

export default DynamicLoading