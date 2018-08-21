import bindAll from 'lodash.bindall';
import React from 'react';
import ArduinoPanelComponent from '../components/arduino-panel/arduino-panel.jsx';


class ArduinoPanel extends React.Component {
    constructor (props) {
        super(props);
        this.state={  //zbl
            editorCode:this.props.editorCode,
            codes:this.props.codes
        };
    }

    componentWillReceiveProps(nextProps, nextState){
        this.setState({
            codes: nextProps.codes,
            code:nextState.codes
        })
    }
    // translateCode(){  //zbl
    //     console.log('wlq' + this.state.codes);
    //     var code=this.state.codes.sb2cpp();
    //     this.setState({editorCode:code});
    // }
    render () {
        const {
            ...props
        } = this.props;
        return (
            <ArduinoPanelComponent
                visible={this.props.visible}
                code={this.props.code}
                consoleMsg={this.props.consoleMsg}
                clearConsole={this.props.clearConsole} //zbl
                translateCode={this.props.translateCode}// arduion translate1
                uploadProj={this.props.uploadProj}//arduion upload3
                openIno={this.props.openIno}//open arduion4
                codeRef={this.props.updateEditorInstance}
                translateChecked={this.props.translateChecked}
                handleInputChange={this.props.handleInputChange}
                consoleSend={this.props.consoleSend}
                restoreFirmware={this.props.restoreFirmware}//2
                windowHeight={this.props.windowHeight}
                {...props}
            />
        );
    }

}

ArduinoPanel.propTypes = {
    // visible: React.PropTypes.bool,
    // kb: React.PropTypes.instanceOf(KittenBlock)
};

export default ArduinoPanel;



