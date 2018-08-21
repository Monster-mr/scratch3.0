import AudioEngine from 'scratch-audio';
import PropTypes from 'prop-types';
import React from 'react';
import VM from '../../scratch-vm';
import {connect} from 'react-redux';
import ReactModal from 'react-modal';
import bindAll from 'lodash.bindall';
//import defaultsDeep from 'lodash.defaultsdeep';
//const shapeFromPropTypes = require('../lib/shape-from-prop-types');
//import shapeFromPropTypes from '../lib/shape-from-prop-types.js';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import {openExtensionLibrary} from '../reducers/modals';
import  KittenBlock  from '../../kittenblock-pc';
import ArduinoPanel from './arduino-panel.jsx';
import Blocks from './blocks.jsx';
//import ScratchBlocks from '../../scratch-blocks';
import {
    activateTab,
    BLOCKS_TAB_INDEX,
    COSTUMES_TAB_INDEX,
    SOUNDS_TAB_INDEX
} from '../reducers/editor-tab';

import {
    closeCostumeLibrary,
    closeBackdropLibrary
} from '../reducers/modals';

import ProjectLoaderHOC from '../lib/project-loader-hoc.jsx';
import vmListenerHOC from '../lib/vm-listener-hoc.jsx';

import GUIComponent from '../components/gui/gui.jsx';
import {STAGE_SIZE_MODES} from "../lib/layout-constants";
// import ArduinoPanel from './arduino-panel.jsx';

class GUI extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, ['toggleArduinoPanel','toggelStage','translateCode','serialDevUpdate','refreshPort','selectPort','portConnected','portOnReadline','portClosed','sendCommonData','portReadLine','deviceQuery','clearConsole','consoleSend','togglePopup',
            "onChange","reloadPlay","uploadProject","updateEditorInstance","openIno","appendLog","restoreFirmware","UndoStack",]);
        this.consoleMsgBuff=[{msg: "Welcome to DCKJ", color: "green"}];
        this.editor;
        this.state = {
            loading: !props.vm.initialized,
            loadingError: false,
            currentModal: null,
            showArduinoPanel: false,
            showStage: true,
            errorMessage: '',
            showPopups:false,
            portDev: [],
            connectedPort: null,
            consoleMsg: this.consoleMsgBuff,
            getInputValue:'Scratch 3.0 GUI',
            editorCode: '#include <Arduino.h>\n\nvoid setup(){\n}\n\nvoid loop(){\n}\n\n',
            windowHeight: window.innerHeight,
        };
    }
    resizeWindow(){
        console.log("window "+window.innerHeight);
        this.setState({windowHeight:window.innerHeight});
    }
    consoleSend(txt){   //zbl 获取值
        this.sendCommonData(txt);
    }
    clearConsole(){
        this.consoleMsgBuff = [];
        this.setState({consoleMsg:this.consoleMsgBuff})
    }
    sendCommonData(msg){
      /*  this.props.kb.sendCmd(msg);
        this.consoleMsgBuff.push({msg:msg,color:"Gray"});
        this.setState({consoleMsg:this.consoleMsgBuff})*/
        this.props.kb.sendCmd(msg);
        if(msg instanceof Uint8Array){
            var msg = Buffer.from(msg).toString('hex')
            this.consoleMsgBuff.push({msg:msg,color:"Gray"});
            this.setState({consoleMsg:this.consoleMsgBuff})
        }else{
            this.consoleMsgBuff.push({msg:msg,color:"Gray"});
            this.setState({consoleMsg:this.consoleMsgBuff})
        }
    }
    portReadLine(line){
        this.props.kb.arduino.parseLine(line);
        this.consoleMsgBuff.push({msg:line,color:"LightSkyBlue"});
        this.setState({consoleMsg:this.consoleMsgBuff})
    }
    deviceQuery(data){
        console.log("query data "+JSON.stringify(data));
        return this.props.kb.arduino.queryData(data);
    }
    componentDidMount () {
        this.refreshPort();   //此处仍存在若干bug
        if (this.props.vm.initialized) return;
        this.audioEngine = new AudioEngine();
        this.props.vm.attachAudioEngine(this.audioEngine);
        this.props.vm.loadProject(this.props.projectData)
            .then(() => {
                this.setState({loading: false}, () => {
                    this.props.vm.setCompatibilityMode(true);
                    this.props.vm.start();
                });
            })
            .catch(e => {
                // Need to catch this error and update component state so that
                // error page gets rendered if project failed to load
                this.setState({loadingError: true, errorMessage: e});
            });
        // kittenblock link hardware
        this.props.vm.runtime.ioDevices.serial.regSendMsg(this.sendCommonData);
        this.props.vm.runtime.ioDevices.serial.regQueryData(this.deviceQuery);
        this.props.kb.arduino.sendCmdEvent.addListener(this.sendCommonData);
        this.props.vm.initialized = true;
        window.onresize = this.resizeWindow;
    }
    componentWillReceiveProps (nextProps) {
        if (this.props.projectData !== nextProps.projectData) {
            this.setState({loading: true}, () => {
                this.props.vm.loadProject(nextProps.projectData)
                    .then(() => {
                        this.setState({loading: false});
                    })
                    .catch(e => {
                        // Need to catch this error and update component state so that
                        // error page gets rendered if project failed to load
                        this.setState({loadingError: true, errorMessage: e});
                    });
            });
        }
    }
    appendLog(msg,color){
        if(!color)
            color = "Gray";
        this.consoleMsgBuff.push({msg:msg,color:color});
        this.setState({consoleMsg:this.consoleMsgBuff})
    }
    serialDevUpdate (data) {
        this.setState({portDev: data});
    }
    refreshPort(){
        this.props.kb.enumPort(this.serialDevUpdate);
    }
    portConnected(port){
        console.log("port connected "+port);
        this.setState({connectedPort:port});
    }
    portOnReadline(line){
        console.log("port get line "+line);
    }
    portClosed(){
        console.log("port closed ");
    }
    selectPort(port){
        console.log("connect to port "+JSON.stringify(port));
        if(port.type=='disconnect'){
            this.props.kb.disonnectPort();
        }else{
            // check if plugin has on Recv method
            if('onRecv' in this.props.kb.plugin){
                var onRecv = this.props.kb.plugin.onRecv;
                this.props.kb.connectPort(port,this.portConnected,this.props.portReadLine,this.portClosed,onRecv);
            }else{
                this.props.kb.connectPort(port,this.portConnected,this.props.portReadLine,this.portClosed);
            }
        }
    }

    toggleArduinoPanel(){
        this.setState({showArduinoPanel: !this.state.showArduinoPanel});
    }
    togglePopup(){
        this.setState({showPopups:!this.state.showPopups}); //zbl 新建项目的的值
    }
    toggelStage(){
        this.setState({showStage: !this.state.showStage}); //点击显示新建项目的弹出框
    }
    onChange(projectName){
        this.setState({getInputValue:projectName.target.value});  //获取input输入框的值
    }
    reloadPlay(){
        document.location.reload(true);   //重做
    }
    UndoStack(){ //撤销
     this.childCp.UndoStacked(false);
    }
   /* UndoStack (redo) {
            var inputStack = redo ? this.redoStack_ : this.undoStack_;//当前状态
            var outputStack = redo ? this.undoStack_ : this.redoStack_;//历史状态
            var inputEvent = inputStack.pop();//执行方法，移除最后一个元素并返回给历史状态(撤销)
        console.log(redo);
        console.log(inputStack);
        console.log(outputStack);
        console.log(inputEvent);
            if (!inputEvent) {
                return;
            }
            var events = [inputEvent];
            // Do another undo/redo if the next one is of the same group.
            while (inputStack.length && inputEvent.group &&
            inputEvent.group == inputStack[inputStack.length - 1].group) {
                events.push(inputStack.pop());//events是移除的那个动作的状态
            }
            // Push these popped events on the opposite stack.
            for (var i = 0, event; event = events[i]; i++) {
                outputStack.push(event);//outputStack为直接添加移除状态的
            }
            events = Blockly.Events.filter(events, redo);
            Blockly.Events.recordUndo = false;
            if (Blockly.selected) {
                Blockly.Events.disable();
                try {
                    Blockly.selected.unselect();
                } finally {
                    Blockly.Events.enable();
                }
            }
            try {
                for (var i = 0, event; event = events[i]; i++) {
                    event.run(redo);
                }
            } finally {
                Blockly.Events.recordUndo = true;
            }
    }*/
    updateEditorInstance(editor){
        this.editor = editor.editor;
    }
    translateCode() {
         var code = this.childCp.sb2cpp();
         this.setState({editorCode: code});
     }
    uploadProject() {  //arduion upload
        var code = this.editor.getValue();
        this.props.kb.uploadProject(code,this.appendLog);
    }
    openIno(){     //arduion open arduion
        var code = this.editor.getValue();
        this.props.kb.openIno(code);
    }
    restoreFirmware(firmware){
        var code = this.props.kb.loadFirmware(firmware.path);
        this.setState({editorCode: code});
    }
    render () {
        if (this.state.loadingError) {
            throw new Error(
                `Failed to load project from server [id=${window.location.hash}]: ${this.state.errorMessage}`);
        }
        const {
            children,
            fetchingProject,
            loadingStateVisible,
            projectData, // eslint-disable-line no-unused-vars
            vm,
            kb,
            ...componentProps
        } = this.props;
/*        blocksProps = defaultsDeep({}, blocksProps, {  ///zbl8.6
            options: {
                media: `${basePath}static/blocks-media/`
            },
            showStage: this.state.showStage
        });*/
        return (
            <GUIComponent
                loading={fetchingProject || this.state.loading || loadingStateVisible}
                toggleArduinoPanel={this.toggleArduinoPanel}
                clearConsole={this.clearConsole}//zbl
                consoleSend={this.consoleSend}//zbl
                togglePopup={this.togglePopup}
                portReadLine={(line)=>this.portReadLine(line)}
                showArduinoPanel={this.state.showArduinoPanel}
                showPopups={this.state.showPopups}
                vm={vm}
                getInputValue={this.state.getInputValue}
                onChange={this.onChange}
                reloadPlay={this.reloadPlay}
                UndoStack={this.UndoStack}
                serialDev={this.state.portDev}
                connectedPort={this.state.connectedPort}
                refreshPort={this.refreshPort}
                selectPort={this.selectPort}
                code={this.state.editorCode}
                showStage={this.state.showStage}
                updateEditorInstance={this.updateEditorInstance}
                uploadProj={this.uploadProject}
                openIno={this.openIno}   //arduion open
                restoreFirmware={this.restoreFirmware}
                editorCode={this.state.editorCode} //zbl 7
                windowHeight={this.state.windowHeight}
                //kb={this.props.kb}
                kb={kb}
                consoleMsg={this.state.consoleMsg}
                {...componentProps}
            >
                <ArduinoPanel visible={this.state.showArduinoPanel}
                                  code={this.state.editorCode}
                                  vm={vm}
                                  translateCode={this.translateCode}
                                  consoleMsg={this.state.consoleMsg}
                                  clearConsole={this.clearConsole}
                                  editorCode={this.state.editorCode}
                                  uploadProj={this.uploadProject}
                                  openIno={this.openIno}
                                  restoreFirmware={this.restoreFirmware}
                                  updateEditorInstance={this.updateEditorInstance}
                                  consoleSend={this.consoleSend}/>
                <Blocks
                    grow={1}
                    getInstance={(childCp) => { this.childCp = childCp; }}
                    isVisible={true}
                    options={{
                        media: `${this.props.basePath}static/blocks-media/`
                    }}
                    // stageSize={stageSize}

                    showStage={this.state.showStage}
                    vm={vm}
                    kb={kb}
                />
            </GUIComponent>
        );
    }
}


GUI.propTypes = {
    ...GUIComponent.propTypes,
    //blocksProps: shapeFromPropTypes(Blocks.propTypes, {omit: ['vm']}),
    fetchingProject: PropTypes.bool,
    toggleArduinoPanel: PropTypes.func,
    consoleSend:PropTypes.func,//zbl
    clearConsole:PropTypes.func,
    toggePoopup:PropTypes.func,
    portReadLine: PropTypes.func,
    importInfoVisible: PropTypes.bool,
    loadingStateVisible: PropTypes.bool,
    onSeeCommunity: PropTypes.func,
    previewInfoVisible: PropTypes.bool,
    projectData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    vm: PropTypes.instanceOf(VM),
    getInputValue:PropTypes.string,
    editorCode:PropTypes.string,
    onChange:PropTypes.func,
    reloadPlay:PropTypes.func,
    UndoStack:PropTypes.func,
/*    translateCode:PropTypes.func,*/
    uploadProj:PropTypes.func,
    openIno:PropTypes.func,
    restoreFirmware:PropTypes.func,
    kb:PropTypes.instanceOf(KittenBlock)
};

// GUI.defaultProps = GUIComponent.defaultProps;     //将km带入这个默认props  wlq
GUI.defaultProps = {
    backpackOptions: {
        host: null,
        visible: false
    },
    basePath: './',
    headerBarProps: {},
    blocksProps: {},
    stageSizeMode: STAGE_SIZE_MODES.large,
    kb: new KittenBlock,
    vm: new VM
};

// GUI.defaultProps = {
//     // backdropLibraryProps: {},
//     // basePath: '/',
//     // blocksProps: {},
//     // costumeLibraryProps: {},
//     // greenFlagProps: {},
//     // spriteSelectorProps: {},
//     // spriteLibraryProps: {},
//     // setupModalProps: {},
//     // stageProps: {},
//     // stopAllProps: {},
//     // arduinoPanelProps: {},
//     // headerBarProps: {},
//     // editorTabsProps: {},
//     vm: new VM(),
//     kb: new KittenBlock()
// };

const mapStateToProps = state => ({
    activeTabIndex: state.scratchGui.editorTab.activeTabIndex,
    backdropLibraryVisible: state.scratchGui.modals.backdropLibrary,
    blocksTabVisible: state.scratchGui.editorTab.activeTabIndex === BLOCKS_TAB_INDEX,
    cardsVisible: state.scratchGui.cards.visible,
    costumeLibraryVisible: state.scratchGui.modals.costumeLibrary,
    costumesTabVisible: state.scratchGui.editorTab.activeTabIndex === COSTUMES_TAB_INDEX,
    importInfoVisible: state.scratchGui.modals.importInfo,
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
    loadingStateVisible: state.scratchGui.modals.loadingProject,
    previewInfoVisible: state.scratchGui.modals.previewInfo,
    targetIsStage: (
        state.scratchGui.targets.stage &&
        state.scratchGui.targets.stage.id === state.scratchGui.targets.editingTarget
    ),
    soundsTabVisible: state.scratchGui.editorTab.activeTabIndex === SOUNDS_TAB_INDEX,
    tipsLibraryVisible: state.scratchGui.modals.tipsLibrary
});

const mapDispatchToProps = dispatch => ({
    onExtensionButtonClick: () => dispatch(openExtensionLibrary()),
    onActivateTab: tab => dispatch(activateTab(tab)),
    onActivateCostumesTab: () => dispatch(activateTab(COSTUMES_TAB_INDEX)),
    onActivateSoundsTab: () => dispatch(activateTab(SOUNDS_TAB_INDEX)),
    onRequestCloseBackdropLibrary: () => dispatch(closeBackdropLibrary()),
    onRequestCloseCostumeLibrary: () => dispatch(closeCostumeLibrary())
});

const ConnectedGUI = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GUI);

const WrappedGui = ErrorBoundaryHOC('Top Level App')(
    ProjectLoaderHOC(vmListenerHOC(ConnectedGUI))
);

WrappedGui.setAppElement = ReactModal.setAppElement;
export default WrappedGui;
