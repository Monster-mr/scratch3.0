const React = require('react');
import {Button,FormControl} from 'react-bootstrap';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/theme/eclipse';
/*import {Button,FormControl,MenuItem,ButtonGroup,DropdownButton } from 'react-bootstrap';*/
const bindAll = require('lodash.bindall'); //zbl
const ReactDOM = require('react-dom');//zbl
/*import {Icon} from 'react-fa';//zbl*/
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
        return (<div
                style={{
                    position: 'absolute',
                    display: visible,
                    zIndex: 9999,
                    right: 0,
                    width: 500,
                    height: 560,
                    top: 90,
                    bottom: 8,
                    backgroundColor: '#0097a7',
                }}
            >
            <div className="group" id="code-buttons" style={{top:4,left:4,width:480,position:'absolute'}}>
                <Button style={{marginLeft:5,height:34}} onClick={this.props.translateCode}><input type="checkbox"/>Translate</Button>
                <Button style={{marginLeft:5}}  onClick={this.props.restoreFirmware}>Restore</Button>
                <Button style={{marginLeft:5}} onClick={this.props.uploadProj}>Upload</Button>
                <Button style={{float:'right'}} onClick={this.props.openIno}>{<img style={{height: 20}} src={arduinoIcon}/>}Open with arduino</Button>
            </div>
            <AceEditor
                style={{top:45,left:2,height:250,width:495}}
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
                width:470,
                height:200,
                top:300,
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
                     top:500,
                     width:470,
                     marginLeft:4,
                     marginTop:8
                 }}
            >
                <FormControl
                    type="text"
                    style={{
                        width: '70%',
                        backgroundColor: '#FFFFFF',
                        border: '0px',
                        color: '#000000'
                    }}
                    ref="consoleInput"  //zbl
                />
                <Button style={{marginLeft:3}} onClick={this.consoleSend}>Send</Button>
                <Button style={{marginLeft:2}} onClick={this.props.clearConsole}>C</Button>
            </form>

            </div>
        );
    }
};


module.exports = ArduinoPanelComponent;


