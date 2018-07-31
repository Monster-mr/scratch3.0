import AudioEngine from 'scratch-audio';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import ReactModal from 'react-modal';
import bindAll from 'lodash.bindall';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import {openExtensionLibrary} from '../reducers/modals';
import  KittenBlock  from '../../pc/kittenblock.js';
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
        bindAll(this, ['toggleArduinoPanel','toggelStage','serialDevUpdate','refreshPort','selectPort','portConnected','portOnReadline','portClosed','sendCommonData','portReadLine','deviceQuery','clearConsole','togglePopup',"onChange","reloadPlay"]);
        this.consoleMsgBuff=[{msg: "Welcome to DCKJ", color: "green"}];
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
            getInputValue:'Scratch 3.0 GUI'

        };
    }
    clearConsole(){
        this.consoleMsgBuff = [];
        this.setState({consoleMsg:this.consoleMsgBuff})
    }
    sendCommonData(msg){
        this.props.kb.sendCmd(msg);
        this.consoleMsgBuff.push({msg:msg,color:"Gray"});
        this.setState({consoleMsg:this.consoleMsgBuff})
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
            this.props.kb.connectPort(port,this.portConnected,this.portOnReadline,this.portClosed);
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
            ...componentProps
        } = this.props;
        return (
            <GUIComponent
                loading={fetchingProject || this.state.loading || loadingStateVisible}
                toggleArduinoPanel={this.toggleArduinoPanel}
                togglePopup={this.togglePopup}
                portReadLine={(line)=>this.portReadLine(line)}
                showArduinoPanel={this.state.showArduinoPanel}
                showPopups={this.state.showPopups}
                vm={vm}
                getInputValue={this.state.getInputValue}
                onChange={this.onChange}
                reloadPlay={this.reloadPlay}
                serialDev={this.state.portDev}
                connectedPort={this.state.connectedPort}
                refreshPort={this.refreshPort}
                selectPort={this.selectPort}
                kb={this.props.kb}
                consoleMsg={this.state.consoleMsg}
                {...componentProps}
            >
                {children}
            </GUIComponent>
        );
    }
}

GUI.propTypes = {
    ...GUIComponent.propTypes,
    fetchingProject: PropTypes.bool,
    toggleArduinoPanel: PropTypes.func,
    toggePoopup:PropTypes.func,
    portReadLine: PropTypes.func,
    importInfoVisible: PropTypes.bool,
    loadingStateVisible: PropTypes.bool,
    onSeeCommunity: PropTypes.func,
    previewInfoVisible: PropTypes.bool,
    projectData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    vm: PropTypes.instanceOf(VM),
    getInputValue:PropTypes.string,
    onChange:PropTypes.func,
    reloadPlay:PropTypes.func,
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
    stageSizeMode: STAGE_SIZE_MODES.large,
    kb: new KittenBlock(),
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
