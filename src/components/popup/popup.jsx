//一个点击新建项目的弹出框

const React = require('react');
import ProjectSaver from '../../containers/project-saver.jsx';

class PopupComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            showPopup:this.props.showPopup
        }
    }
    componentWillReceiveProps(nextProps, nextState){
        this.setState({
            showPopup: nextProps.showPopup
        })
    }
/*    cancelOperation(){
        debugger;
        this.setState({
            showPopup:!this.props.showPopup
        })
    }*/
    render() {
        const {
            ...componentProps
        } = this.props;
        var showPopup = this.state.showPopup?"block":"none";
        var stylePop={display: showPopup, width: '300px', height: '150px', background: '#ffffff', position: 'absolute', left: '50%',
            top: '70px', marginLeft: '-150px', boxShadow: '10px 10px 8px #888888', zIndex:'99999',};
        var popupTxt={width:'300px', height:'40px', lineHeight: '40px', fontSize: '22px', textAlign: 'center', marginTop:'20px',};
        var popupBtn={marginTop: '55px',};
        var btnButton={width: '80px', textAlign: 'center', marginLeft: '15px', overflow: 'hidden',}
        return (
            <div style={stylePop}>
                <div style={popupTxt}>请您做出选择</div>
                <div style={popupBtn}>
                        <ProjectSaver>{(saveProject, saveProps) => (
                        <button
                            style={btnButton}
                            onClick={saveProject}
                            {...saveProps}
                        >保存修改
                        </button>
                    )}</ProjectSaver>
                    <button style={btnButton}>新建项目</button>
                    <button style={btnButton} onClick={this.props.togglePopup}>取消操作</button>
                </div>
            </div>
        )
    }
};

export default PopupComponent;
