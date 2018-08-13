const React = require('react');
import {Button,FormControl} from 'react-bootstrap';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/theme/eclipse';
//import {Button,FormControl,MenuItem,ButtonGroup,DropdownButton } from 'react-bootstrap';
const bindAll = require('lodash.bindall'); //zbl
const ReactDOM = require('react-dom');//zbl
//import {Icon} from 'react-fa';//zbl
const arduinoIcon = require('./arduino.png');

class ArduinoPanelComponent extends React.Component {
    constructor (props) {              //zbl
        super(props);
        bindAll(this, ['consoleSend','consoleEnter']);
    }
    //zbl
    consoleSend(){
        var txt = ReactDOM.findDOMNode(this.refs.consoleInput).value;//ReactDOM.findDOMNode获取到真实的dom
        this.props.consoleSend(txt);
        ReactDOM.findDOMNode(this.refs.consoleInput).value='';
    };
    consoleEnter(e){
        e.preventDefault();
        this.consoleSend();
        return false;
    };
    componentDidUpdate(){
        var logs = this.refs.arduinolog;
        var lastLog = logs.childNodes[logs.childNodes.length-1];
        if(lastLog) {
            lastLog.scrollIntoView();
        }
    }
    render() {
        const {
            code,
            consoleMsg,
            codeRef,
            ...componentProps
        } = this.props;
        var visible = this.props.visible?'block':'none';
        const  msgs = [];
        for (var i = 0; i <  this.props.consoleMsg.length; i += 1) {
            var t =  this.props.consoleMsg[i];
            msgs.push(<p style={{color:t.color}} key={i}>{t.msg}</p>);
        };
/*        for (var i = 0; i < this.props.consoleMsg.length; i += 1) {
            var t = this.props.consoleMsg[i];
            msgs.push(<p style={{color:t.color}} key={i}>{t.msg}</p>);
        };*/
        var panelHeight=this.props.windowHeight-'3.1rem';
        return (<div
                style={{
                    position: 'absolute',
                    display: visible,
                    zIndex: 99999,
                    right: 1,
                    width: 500,
                    height: panelHeight,
                    top: '3.1rem',
                    bottom: 2,
                    backgroundColor: '#4C97FF',
                }}
            >
            <div className="group" id="code-buttons" style={{top:4,left:4,width:480,position:'absolute'}}>
                <Button style={{marginLeft:5,height:34}} onClick={this.props.translateCode}><input type="checkbox"/>Translate</Button>
                <Button style={{marginLeft:5,height:34}}  onClick={this.props.restoreFirmware}>Restore</Button>
                <Button style={{marginLeft:5,height:34}} onClick={this.props.uploadProj}>Upload</Button>
                <Button style={{float:'right',height:34}} onClick={this.props.openIno}>{<img style={{height: 20}} src={arduinoIcon}/>}Open with arduino</Button>
            </div>
            <AceEditor
                //panelHeight*0.5
                style={{top:45,left:2,height:'45%',width:495}}
                mode="c_cpp"
                theme="eclipse"
                name="arduino-code"
                value={code}
                editorProps={{$blockScrolling: true}}
                ref={codeRef}
            />
            <div id="console-log"
            style={{
                position: 'absolute',
                left:2,
                width:490,
                //height:panelHeight*0.5-100,
                height:'40%',
                top:'52%',
                //top:panelHeight*0.5+50,
                overflowY: 'scroll',
                backgroundColor: '#000000',
                color: '#008000',
                fontSize:18
            }}
                 ref="arduinolog"   //zbl
            >{msgs}
            </div>
            <form className="form-inline" id="console-input"
                  onSubmit={this.consoleEnter} //zbl
                 style={{
                     position:'absolute',
                     bottom:10,
                     width:470,
                     marginLeft:4,
                     marginTop:4
                 }}
            >
                <FormControl
                    type="text"
                    style={{
                        width: '76%',
                        height:'28px',
                        backgroundColor: '#FFFFFF',
                        border: '0px',
                        color: '#000000',
                        paddingLeft:'8px'
                    }}
                    ref="consoleInput"  //zbl
                />
                <Button style={{marginLeft:4, width:'10%',height:'28px'}} onClick={this.consoleSend}>Send</Button>
                <Button style={{marginLeft:3, width:'10%',height:'28px'}} onClick={this.props.clearConsole}>C</Button>
            </form>

            </div>
        );
    }
};


module.exports = ArduinoPanelComponent;


