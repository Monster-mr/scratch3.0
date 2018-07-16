const React = require('react');
import './popup.css';

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            showPopup:this.props.showPopup
        }
        this.cancelOperation=this.cancelOperation.bind(this)
    }
    componentWillReceiveProps(nextProps, nextState){
        this.setState({
            showPopup: nextProps.showPopup
        })
    }
    cancelOperation(){
        this.setState({
            showPopup:false
        })
    }
    render() {
        const {
            openLoadProjectDialog,
            openSaveProjectDialog,
            ...componentProps
        } = this.props;
        return (
            <div className={(this.state.showPopup==true)?"popup":"error"}>
                <div className={"popup-txt"}>请您做出选择</div>
                <div className={"popup-btn"}>
                    <button onClick={openSaveProjectDialog}>保存修改</button>
                    <button>新建项目</button>
                    <button onClick={this.cancelOperation}>取消操作</button>
                </div>
            </div>
        )
    }
};

export default Popup;
