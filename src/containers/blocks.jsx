import bindAll from 'lodash.bindall';
import debounce from 'lodash.debounce';
import defaultsDeep from 'lodash.defaultsdeep';
import makeToolboxXML from '../lib/make-toolbox-xml';
import PropTypes from 'prop-types';
import React from 'react';
import VMScratchBlocks from '../lib/blocks';
import VM from '../../scratch-vm';

import analytics from '../lib/analytics';
import Prompt from './prompt.jsx';
import BlocksComponent from '../components/blocks/blocks.jsx';
import ExtensionLibrary from './extension-library.jsx';
import CustomProcedures from './custom-procedures.jsx';
import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import {STAGE_DISPLAY_SIZES} from '../lib/layout-constants';
// import ScratchBlocks from '../../scratch-blocks';
// import ArduinoGenerator from '../lib/arduino-generator';
import Blockly from '../../scratch-blocks';
// console.log(new Blockly.Generator('Arduino'));
// import Arduino from '../lib/arduino-generator';
Blockly.Arduino=new Blockly.Generator("Arduino");Blockly.Arduino.addReservedWords("_,void,char");Blockly.Arduino.ORDER_ATOMIC=0;Blockly.Arduino.ORDER_HIGH=1;Blockly.Arduino.ORDER_EXPONENTIATION=2;Blockly.Arduino.ORDER_UNARY=3;Blockly.Arduino.ORDER_MULTIPLICATIVE=4;Blockly.Arduino.ORDER_ADDITIVE=5;Blockly.Arduino.ORDER_CONCATENATION=6;Blockly.Arduino.ORDER_RELATIONAL=7;Blockly.Arduino.ORDER_AND=8;Blockly.Arduino.ORDER_OR=9;Blockly.Arduino.ORDER_NONE=99;Blockly.Arduino.Null=0;
Blockly.Arduino.Setup=1;Blockly.Arduino.Loop=2;Blockly.Arduino.INDENT="\t";Blockly.Arduino.END=";\n";Blockly.Arduino.Header="#include <Arduino.h>\n";Blockly.Arduino.init=function(a){Blockly.Arduino.definitions_=Object.create(null);Blockly.Arduino.includes_=Object.create(null);Blockly.Arduino.codeStage=Blockly.Arduino.Setup;Blockly.Arduino.tabPos=1;Blockly.Arduino.variableDB_?Blockly.Arduino.variableDB_.reset():Blockly.Arduino.variableDB_=new Blockly.Names(Blockly.Arduino.RESERVED_WORDS_)};
Blockly.Arduino.finish=function(a){var b=[];for(d in Blockly.Arduino.definitions_)b.push(Blockly.Arduino.definitions_[d]);var c=[];for(d in Blockly.Arduino.includes_)c.push(Blockly.Arduino.includes_[d]);var d=Blockly.Arduino.Header;d+=c.join("\n\n");d=d+"\n\n"+b.join("\n\n");d=d+"\n\nvoid setup(){\n"+a+"\n}\n";Blockly.Arduino.codeStage==Blockly.Arduino.Setup&&(d+="\nvoid loop(){\n\n}\n");delete Blockly.Arduino.definitions_;delete Blockly.Arduino.includes_;delete Blockly.Arduino.codeStage;Blockly.Arduino.variableDB_.reset();
    return d};Blockly.Arduino.scrub_=function(a,b){a=a.nextConnection&&a.nextConnection.targetBlock();a=Blockly.Arduino.blockToCode(a);return b+a};Blockly.Arduino.scrubNakedValue=function(a){return a+"\n"};Blockly.Arduino.quote_=function(a){return a=a.replace(/\\/g,"\\\\").replace(/\n/g,"\\\n").replace(/%/g,"\\%").replace(/'/g,"\\'")};Blockly.Arduino.tab=function(){return Blockly.Arduino.INDENT.repeat(Blockly.Arduino.tabPos)};Blockly.Arduino.arduino={};Blockly.Arduino.event_arduinobegin=function(a){Blockly.Arduino.codeStage=Blockly.Arduino.Loop;Blockly.Arduino.tabPos=0;var b=Blockly.Arduino.statementToCode(a,"SUBSTACK");b=Blockly.Arduino.addLoopTrap(b,a.id);var c=Blockly.Arduino.statementToCode(a,"SUBSTACK2");c=Blockly.Arduino.addLoopTrap(c,a.id);return a=b+"\n}\n\nvoid loop(){\n"+c};
Blockly.Arduino.arduino_pin_mode=function(a){var b=Blockly.Arduino.ORDER_NONE,c=Blockly.Arduino.valueToCode(a,"PINNUM",b);a=Blockly.Arduino.valueToCode(a,"ARDUINO_PIN_MODE_OPTION",b);return Blockly.Arduino.tab()+"pinMode("+c+","+a+")"+Blockly.Arduino.END};Blockly.Arduino.arduino_pwm_write=function(a){var b=Blockly.Arduino.ORDER_NONE,c=Blockly.Arduino.valueToCode(a,"ARDUINO_PWM_OPTION",b);a=Blockly.Arduino.valueToCode(a,"PWM",b);return Blockly.Arduino.tab()+"analogWrite("+c+","+a+")"+Blockly.Arduino.END};
Blockly.Arduino.arduino_digital_write=function(a){var b=Blockly.Arduino.ORDER_NONE,c=Blockly.Arduino.valueToCode(a,"PINNUM",b);a=Blockly.Arduino.valueToCode(a,"ARDUINO_LEVEL_OPTION",b);return Blockly.Arduino.tab()+"digitalWrite("+c+","+a+")"+Blockly.Arduino.END};Blockly.Arduino.arduino_digital_read=function(a){var b=Blockly.Arduino.ORDER_NONE;return["digitalRead("+Blockly.Arduino.valueToCode(a,"PINNUM",b)+")",b]};
Blockly.Arduino.arduino_analog_read=function(a){var b=Blockly.Arduino.ORDER_NONE;return["analogRead("+Blockly.Arduino.valueToCode(a,"PINNUM",b)+")",b]};Blockly.Arduino.arduino_map=function(a){var b=Blockly.Arduino.ORDER_NONE,c=Blockly.Arduino.valueToCode(a,"VAL",b),d=Blockly.Arduino.valueToCode(a,"FROMLOW",b),e=Blockly.Arduino.valueToCode(a,"FROMHIGH",b),f=Blockly.Arduino.valueToCode(a,"TOLOW",b);a=Blockly.Arduino.valueToCode(a,"TOHIGH",b);return["map("+c+","+d+","+e+","+f+","+a+")",b]};
Blockly.Arduino.arduino_tone=function(a){var b=Blockly.Arduino.ORDER_NONE,c=Blockly.Arduino.valueToCode(a,"PINNUM",b),d=Blockly.Arduino.valueToCode(a,"FREQUENCY",b);a=Blockly.Arduino.valueToCode(a,"DURATION",b);return Blockly.Arduino.tab()+"tone("+c+","+d+","+a+")"+Blockly.Arduino.END};
Blockly.Arduino.arduino_servo=function(a){var b=Blockly.Arduino.ORDER_NONE;Blockly.Arduino.includes_.servo="#include <Servo.h>";Blockly.Arduino.definitions_.servo="Servo servo;";var c=Blockly.Arduino.valueToCode(a,"PINNUM",b);a=Blockly.Arduino.valueToCode(a,"ANGLE",b);c=Blockly.Arduino.tab()+"servo.attach("+c+")"+Blockly.Arduino.END;return c+=Blockly.Arduino.tab()+"servo.write("+a+")"+Blockly.Arduino.END};Blockly.Arduino.arduino_menu_option=function(a){return[a.inputList[0].fieldRow[0].value_,Blockly.Arduino.ORDER_ATOMIC]};
Blockly.Arduino.arduino_println=function(a){a=Blockly.Arduino.valueToCode(a,"TEXT",Blockly.Arduino.ORDER_NONE);return-1<a.indexOf("(")?Blockly.Arduino.tab()+"Serial.println("+a+")"+Blockly.Arduino.END:Blockly.Arduino.tab()+'Serial.println("'+a+'")'+Blockly.Arduino.END};Blockly.Arduino.arduino_pin_mode_option=Blockly.Arduino.arduino_menu_option;Blockly.Arduino.arduino_pwm_option=Blockly.Arduino.arduino_menu_option;Blockly.Arduino.arduino_level_option=Blockly.Arduino.arduino_menu_option;
Blockly.Arduino.arduino_analog_in_option=Blockly.Arduino.arduino_menu_option;Blockly.Arduino.control={};Blockly.Arduino.control_wait=function(a){a=Blockly.Arduino.valueToCode(a,"DURATION",Blockly.Arduino.ORDER_HIGH)+"*1000";return Blockly.Arduino.tab()+"delay("+a+")"+Blockly.Arduino.END};
Blockly.Arduino.control_repeat=function(a){var b=Blockly.Arduino.valueToCode(a,"TIMES",Blockly.Arduino.ORDER_HIGH),c=Blockly.Arduino.statementToCode(a,"SUBSTACK");c=Blockly.Arduino.addLoopTrap(c,a.id);a=Blockly.Arduino.tab()+"for(int i=0;i<"+b+";i++){\n";Blockly.Arduino.tabPos++;Blockly.Arduino.tabPos--;return a=a+c+(Blockly.Arduino.tab()+"}\n")};
Blockly.Arduino.control_forever=function(a){var b=Blockly.Arduino.tab()+"while(1){\n";Blockly.Arduino.tabPos++;var c=Blockly.Arduino.statementToCode(a,"SUBSTACK");c=Blockly.Arduino.addLoopTrap(c,a.id);Blockly.Arduino.tabPos--;return b=b+c+(Blockly.Arduino.tab()+"}\n")};
Blockly.Arduino.control_if=function(a){var b=Blockly.Arduino.valueToCode(a,"CONDITION",Blockly.Arduino.ORDER_NONE)||"false",c=Blockly.Arduino.statementToCode(a,"SUBSTACK");c=Blockly.Arduino.addLoopTrap(c,a.id);a=Blockly.Arduino.tab()+"if("+b+"){\n";Blockly.Arduino.tabPos++;Blockly.Arduino.tabPos--;return a=a+c+(Blockly.Arduino.tab()+"}\n")};
Blockly.Arduino.control_if_else=function(a){var b=Blockly.Arduino.valueToCode(a,"CONDITION",Blockly.Arduino.ORDER_NONE)||"false",c=Blockly.Arduino.statementToCode(a,"SUBSTACK");c=Blockly.Arduino.addLoopTrap(c,a.id);Blockly.Arduino.statementToCode(a,"SUBSTACK2");a=Blockly.Arduino.addLoopTrap(c,a.id);b=Blockly.Arduino.tab()+"if("+b+"){\n";Blockly.Arduino.tabPos++;Blockly.Arduino.tabPos--;b=b+c+(Blockly.Arduino.tab()+"}else{\n");Blockly.Arduino.tabPos++;Blockly.Arduino.tabPos--;return b=b+a+(Blockly.Arduino.tab()+
    "}\n")};Blockly.Arduino.looks_say=function(a){a=Blockly.Arduino.valueToCode(a,"MESSAGE",Blockly.Arduino.ORDER_ATOMIC);return Blockly.Arduino.tab()+"Serial.println(String('"+a+"'));\n"};Blockly.Arduino.event={};Blockly.Arduino.event_whenflagclicked=function(a){return""};Blockly.Arduino.operator={};Blockly.Arduino.math_number=function(a){return[parseFloat(a.getFieldValue("NUM")),Blockly.Arduino.ORDER_ATOMIC]};Blockly.Arduino.text=function(a){return[Blockly.Arduino.quote_(a.getFieldValue("TEXT")),Blockly.Arduino.ORDER_ATOMIC]};Blockly.Arduino.operator_random=function(a){var b=Blockly.Arduino.valueToCode(a,"FROM",Blockly.Arduino.ORDER_HIGH)||"0";a=Blockly.Arduino.valueToCode(a,"TO",Blockly.Arduino.ORDER_HIGH)||"0";return["random("+b+","+a+")",Blockly.Arduino.ORDER_HIGH]};
Blockly.Arduino.operator_compare=function(a){var b=Blockly.Arduino.valueToCode(a,"OPERAND1",Blockly.Arduino.ORDER_HIGH)||"0",c=Blockly.Arduino.valueToCode(a,"OPERAND2",Blockly.Arduino.ORDER_HIGH)||"0";return[b+{operator_gt:">",operator_equals:"==",operator_lt:"<"}[a.type]+c,Blockly.Arduino.ORDER_RELATIONAL]};
Blockly.Arduino.operator_arithmetic=function(a){var b=Blockly.Arduino.valueToCode(a,"NUM1",Blockly.Arduino.ORDER_HIGH)||"0",c=Blockly.Arduino.valueToCode(a,"NUM2",Blockly.Arduino.ORDER_HIGH)||"0",d=Blockly.Arduino.ORDER_ADDITIVE;"operator_multiply"!=a.type&&"operator_divide"!=a.type||--d;return[b+{operator_add:"+",operator_subtract:"-",operator_multiply:"*",operator_divide:"/"}[a.type]+c,d]};Blockly.Arduino.operator_add=Blockly.Arduino.operator_arithmetic;Blockly.Arduino.operator_subtract=Blockly.Arduino.operator_arithmetic;
Blockly.Arduino.operator_multiply=Blockly.Arduino.operator_arithmetic;Blockly.Arduino.operator_divide=Blockly.Arduino.operator_arithmetic;Blockly.Arduino.operator_gt=Blockly.Arduino.operator_compare;Blockly.Arduino.operator_equals=Blockly.Arduino.operator_compare;Blockly.Arduino.operator_lt=Blockly.Arduino.operator_compare;Blockly.Arduino.math_angle=Blockly.Arduino.math_number;Blockly.Arduino.math_positive_number=Blockly.Arduino.math_number;Blockly.Arduino.math_whole_number=Blockly.Arduino.math_number;

import {connect} from 'react-redux';
import {updateToolbox} from '../reducers/toolbox';
import {activateColorPicker} from '../reducers/color-picker';
import {closeExtensionLibrary} from '../reducers/modals';
import {activateCustomProcedures, deactivateCustomProcedures} from '../reducers/custom-procedures';

const addFunctionListener = (object, property, callback) => {
    const oldFn = object[property];
    object[property] = function () {
        const result = oldFn.apply(this, arguments);
        callback.apply(this, result);
        return result;
    };
};

class Blocks extends React.Component {
    constructor (props) {
        super(props);
        this.ScratchBlocks = VMScratchBlocks(props.vm);
        bindAll(this, [
            'attachVM',
            'detachVM',
            'handleCategorySelected',
            'handlePromptStart',
            'handlePromptCallback',
            'handlePromptClose',
            'handleCustomProceduresClose',
            'onScriptGlowOn',
            'onScriptGlowOff',
            'onBlockGlowOn',
            'onBlockGlowOff',
            'handleExtensionAdded',
            'handleBlocksInfoUpdate',
            'onTargetsUpdate',
            'onVisualReport',
            'onWorkspaceUpdate',
            'onWorkspaceMetricsChange',
            'setBlocks',
            'sb2cpp',
            'setLocale'
        ]);
        this.ScratchBlocks.prompt = this.handlePromptStart;
        this.state = {
            workspaceMetrics: {},
            prompt:null
        };
        this.onTargetsUpdate = debounce(this.onTargetsUpdate, 100);
        this.toolboxUpdateQueue = [];
        const { getInstance } = props;
        if (typeof getInstance === 'function') {
            getInstance(this); // 在这里把this暴露给`parentComponent`
        }
    }
    componentDidMount () {
        this.ScratchBlocks.FieldColourSlider.activateEyedropper_ = this.props.onActivateColorPicker;
        this.ScratchBlocks.Procedures.externalProcedureDefCallback = this.props.onActivateCustomProcedures;

        const workspaceConfig = defaultsDeep({},
            Blocks.defaultOptions,
            this.props.options,
            {toolbox: this.props.toolboxXML}
        );
        this.workspace = this.ScratchBlocks.inject(this.blocks, workspaceConfig);

        // we actually never want the workspace to enable "refresh toolbox" - this basically re-renders the
        // entire toolbox every time we reset the workspace.  We call updateToolbox as a part of
        // componentDidUpdate so the toolbox will still correctly be updated
        this.setToolboxRefreshEnabled = this.workspace.setToolboxRefreshEnabled.bind(this.workspace);
        this.workspace.setToolboxRefreshEnabled = () => {
            this.setToolboxRefreshEnabled(false);
        };

        // @todo change this when blockly supports UI events
        addFunctionListener(this.workspace, 'translate', this.onWorkspaceMetricsChange);
        addFunctionListener(this.workspace, 'zoom', this.onWorkspaceMetricsChange);

        this.attachVM();
        this.setLocale();

        analytics.pageview('/editors/blocks');
    }
    shouldComponentUpdate (nextProps, nextState) {
        return (
            this.state.prompt !== nextState.prompt ||
            this.props.isVisible !== nextProps.isVisible ||
            this.props.toolboxXML !== nextProps.toolboxXML ||
            this.props.extensionLibraryVisible !== nextProps.extensionLibraryVisible ||
            this.props.customProceduresVisible !== nextProps.customProceduresVisible ||
            this.props.locale !== nextProps.locale ||
            this.props.anyModalVisible !== nextProps.anyModalVisible ||
            this.props.stageSize !== nextProps.stageSize
        );
    }
    componentDidUpdate (prevProps) {
        // If any modals are open, call hideChaff to close z-indexed field editors
        if (this.props.anyModalVisible && !prevProps.anyModalVisible) {
            this.ScratchBlocks.hideChaff();
        }

        if (prevProps.locale !== this.props.locale) {
            this.setLocale();
        }

        if (prevProps.toolboxXML !== this.props.toolboxXML) {
            // rather than update the toolbox "sync" -- update it in the next frame
            clearTimeout(this.toolboxUpdateTimeout);
            this.toolboxUpdateTimeout = setTimeout(() => {
                this.updateToolbox();
            }, 0);
        }
        if (this.props.isVisible === prevProps.isVisible) {
            if (this.props.stageSize !== prevProps.stageSize) {
                // force workspace to redraw for the new stage size
                window.dispatchEvent(new Event('resize'));
            }
            return;
        }
        // @todo hack to resize blockly manually in case resize happened while hidden
        // @todo hack to reload the workspace due to gui bug #413
        if (this.props.isVisible) { // Scripts tab
            this.workspace.setVisible(true);
            this.props.vm.refreshWorkspace();
            // Re-enable toolbox refreshes without causing one. See #updateToolbox for more info.
            this.workspace.toolboxRefreshEnabled_ = true;
            window.dispatchEvent(new Event('resize'));
        } else {
            this.workspace.setVisible(false);
        }
    }
    componentWillUnmount () {
        this.detachVM();
        this.workspace.dispose();
        clearTimeout(this.toolboxUpdateTimeout);
    }

    setLocale () {
        this.workspace.getFlyout().setRecyclingEnabled(false);
        this.ScratchBlocks.ScratchMsgs.setLocale(this.props.locale);
        this.props.vm.setLocale(this.props.locale, this.props.messages);

        this.workspace.updateToolbox(this.props.toolboxXML);
        this.props.vm.refreshWorkspace();
        this.workspace.getFlyout().setRecyclingEnabled(true);
    }

    updateToolbox () {
        this.toolboxUpdateTimeout = false;

        const categoryId = this.workspace.toolbox_.getSelectedCategoryId();
        const offset = this.workspace.toolbox_.getCategoryScrollOffset();
        this.workspace.updateToolbox(this.props.toolboxXML);
        // In order to catch any changes that mutate the toolbox during "normal runtime"
        // (variable changes/etc), re-enable toolbox refresh.
        // Using the setter function will rerender the entire toolbox which we just rendered.
        this.workspace.toolboxRefreshEnabled_ = true;

        const currentCategoryPos = this.workspace.toolbox_.getCategoryPositionById(categoryId);
        const currentCategoryLen = this.workspace.toolbox_.getCategoryLengthById(categoryId);
        if (offset < currentCategoryLen) {
            this.workspace.toolbox_.setFlyoutScrollPos(currentCategoryPos + offset);
        } else {
            this.workspace.toolbox_.setFlyoutScrollPos(currentCategoryPos);
        }

        const queue = this.toolboxUpdateQueue;
        this.toolboxUpdateQueue = [];
        queue.forEach(fn => fn());
    }

    withToolboxUpdates (fn) {
        // if there is a queued toolbox update, we need to wait
        if (this.toolboxUpdateTimeout) {
            this.toolboxUpdateQueue.push(fn);
        } else {
            fn();
        }
    }

    attachVM () {
        this.workspace.addChangeListener(this.props.vm.blockListener);
        this.flyoutWorkspace = this.workspace
            .getFlyout()
            .getWorkspace();
        this.flyoutWorkspace.addChangeListener(this.props.vm.flyoutBlockListener);
        this.flyoutWorkspace.addChangeListener(this.props.vm.monitorBlockListener);
        this.props.vm.addListener('SCRIPT_GLOW_ON', this.onScriptGlowOn);
        this.props.vm.addListener('SCRIPT_GLOW_OFF', this.onScriptGlowOff);
        this.props.vm.addListener('BLOCK_GLOW_ON', this.onBlockGlowOn);
        this.props.vm.addListener('BLOCK_GLOW_OFF', this.onBlockGlowOff);
        this.props.vm.addListener('VISUAL_REPORT', this.onVisualReport);
        this.props.vm.addListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.addListener('targetsUpdate', this.onTargetsUpdate);
        this.props.vm.addListener('EXTENSION_ADDED', this.handleExtensionAdded);
        this.props.vm.addListener('BLOCKSINFO_UPDATE', this.handleBlocksInfoUpdate);
    }
    detachVM () {
        this.props.vm.removeListener('SCRIPT_GLOW_ON', this.onScriptGlowOn);
        this.props.vm.removeListener('SCRIPT_GLOW_OFF', this.onScriptGlowOff);
        this.props.vm.removeListener('BLOCK_GLOW_ON', this.onBlockGlowOn);
        this.props.vm.removeListener('BLOCK_GLOW_OFF', this.onBlockGlowOff);
        this.props.vm.removeListener('VISUAL_REPORT', this.onVisualReport);
        this.props.vm.removeListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.removeListener('targetsUpdate', this.onTargetsUpdate);
        this.props.vm.removeListener('EXTENSION_ADDED', this.handleExtensionAdded);
        this.props.vm.removeListener('BLOCKSINFO_UPDATE', this.handleBlocksInfoUpdate);
    }

    updateToolboxBlockValue (id, value) {
        this.withToolboxUpdates(() => {
            const block = this.workspace
                .getFlyout()
                .getWorkspace()
                .getBlockById(id);
            if (block) {
                block.inputList[0].fieldRow[0].setValue(value);
            }
        });
    }

    onTargetsUpdate () {
        if (this.props.vm.editingTarget) {
            ['glide', 'move', 'set'].forEach(prefix => {
                this.updateToolboxBlockValue(`${prefix}x`, Math.round(this.props.vm.editingTarget.x).toString());
                this.updateToolboxBlockValue(`${prefix}y`, Math.round(this.props.vm.editingTarget.y).toString());
            });
        }
    }
    onWorkspaceMetricsChange () {
        const target = this.props.vm.editingTarget;
        if (target && target.id) {
            const workspaceMetrics = Object.assign({}, this.state.workspaceMetrics, {
                [target.id]: {
                    scrollX: this.workspace.scrollX,
                    scrollY: this.workspace.scrollY,
                    scale: this.workspace.scale
                }
            });
            this.setState({workspaceMetrics});
        }
    }
    onScriptGlowOn (data) {
        this.workspace.glowStack(data.id, true);
    }
    onScriptGlowOff (data) {
        this.workspace.glowStack(data.id, false);
    }
    onBlockGlowOn (data) {
        this.workspace.glowBlock(data.id, true);
    }
    onBlockGlowOff (data) {
        this.workspace.glowBlock(data.id, false);
    }
    onVisualReport (data) {
        this.workspace.reportValue(data.id, data.value);
    }
    onWorkspaceUpdate (data) {
        // When we change sprites, update the toolbox to have the new sprite's blocks
        if (this.props.vm.editingTarget) {
            const target = this.props.vm.editingTarget;
            const dynamicBlocksXML = this.props.vm.runtime.getBlocksXML();
            const toolboxXML = makeToolboxXML(target.isStage, target.id, dynamicBlocksXML);
            this.props.updateToolboxState(toolboxXML);
        }

        if (this.props.vm.editingTarget && !this.state.workspaceMetrics[this.props.vm.editingTarget.id]) {
            this.onWorkspaceMetricsChange();
        }

        // Remove and reattach the workspace listener (but allow flyout events)
        this.workspace.removeChangeListener(this.props.vm.blockListener);
        const dom = this.ScratchBlocks.Xml.textToDom(data.xml);
        this.ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(dom, this.workspace);
        this.workspace.addChangeListener(this.props.vm.blockListener);

        if (this.props.vm.editingTarget && this.state.workspaceMetrics[this.props.vm.editingTarget.id]) {
            const {scrollX, scrollY, scale} = this.state.workspaceMetrics[this.props.vm.editingTarget.id];
            this.workspace.scrollX = scrollX;
            this.workspace.scrollY = scrollY;
            this.workspace.scale = scale;
            this.workspace.resize();
        }
    }
    handleExtensionAdded (blocksInfo) {
        // select JSON from each block info object then reject the pseudo-blocks which don't have JSON, like separators
        // this actually defines blocks and MUST run regardless of the UI state
        this.ScratchBlocks.defineBlocksWithJsonArray(blocksInfo.map(blockInfo => blockInfo.json).filter(x => x));

        // update the toolbox view: this can be skipped if we're not looking at a target, etc.
        const runtime = this.props.vm.runtime;
        const target = runtime.getEditingTarget() || runtime.getTargetForStage();
        if (target) {
            const dynamicBlocksXML = runtime.getBlocksXML();
            const toolboxXML = makeToolboxXML(target.isStage, target.id, dynamicBlocksXML);
            this.props.updateToolboxState(toolboxXML);
        }
    }
    handleBlocksInfoUpdate (blocksInfo) {
        // @todo Later we should replace this to avoid all the warnings from redefining blocks.
        this.handleExtensionAdded(blocksInfo);
    }
    handleCategorySelected (categoryId) {
        this.withToolboxUpdates(() => {
            this.workspace.toolbox_.setSelectedCategoryById(categoryId);
        });
    }
    setBlocks (blocks) {
        this.blocks = blocks;
    }
    sb2cpp(){
        try {
            var code = "";
            console.log(this.workspace);
            code = code +  Blockly.Arduino.workspaceToCode(this.workspace);
        } catch(e) {
            alert(e.message + "Arduino暂不支持,请移除该模块"); // 暂且先这样
            console.log(e.message);
        }
        return code;
    }
    handlePromptStart (message, defaultValue, callback, optTitle, optVarType) {
        const p = {prompt: {callback, message, defaultValue}};
        p.prompt.title = optTitle ? optTitle :
            this.ScratchBlocks.VARIABLE_MODAL_TITLE;
        p.prompt.showMoreOptions =
            optVarType !== this.ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE;
        this.setState(p);
    }
    handlePromptCallback (data) {
        this.state.prompt.callback(data);
        this.handlePromptClose();
    }
    handlePromptClose () {
        this.setState({prompt: null});
    }
    handleCustomProceduresClose (data) {
        this.props.onRequestCloseCustomProcedures(data);
        const ws = this.workspace;
        ws.refreshToolboxSelection_();
        ws.toolbox_.scrollToCategoryById('myBlocks');
    }
    render () {
        /* eslint-disable no-unused-vars */
        const {
            anyModalVisible,
            customProceduresVisible,
            extensionLibraryVisible,
            options,
            stageSize,
            vm,
            isVisible,
            onActivateColorPicker,
            updateToolboxState,
            onActivateCustomProcedures,
            onRequestCloseExtensionLibrary,
            onRequestCloseCustomProcedures,
            toolboxXML,
            ...props
        } = this.props;
        /* eslint-enable no-unused-vars */
        return (
            <div>
                <BlocksComponent
                    componentRef={this.setBlocks}
                    {...props}
                />
                {this.state.prompt ? (
                    <Prompt
                        label={this.state.prompt.message}
                        placeholder={this.state.prompt.defaultValue}
                        showMoreOptions={this.state.prompt.showMoreOptions}
                        title={this.state.prompt.title}
                        onCancel={this.handlePromptClose}
                        onOk={this.handlePromptCallback}
                    />
                ) : null}
                {extensionLibraryVisible ? (
                    <ExtensionLibrary
                        vm={vm}
                        onCategorySelected={this.handleCategorySelected}
                        onRequestClose={onRequestCloseExtensionLibrary}
                    />
                ) : null}
                {customProceduresVisible ? (
                    <CustomProcedures
                        options={{
                            media: options.media
                        }}
                        onRequestClose={this.handleCustomProceduresClose}
                    />
                ) : null}
            </div>
        );
    }
}

Blocks.propTypes = {
    anyModalVisible: PropTypes.bool,
    customProceduresVisible: PropTypes.bool,
    extensionLibraryVisible: PropTypes.bool,
    isVisible: PropTypes.bool,
    locale: PropTypes.string,
    messages: PropTypes.objectOf(PropTypes.string),
    onActivateColorPicker: PropTypes.func,
    onActivateCustomProcedures: PropTypes.func,
    onRequestCloseCustomProcedures: PropTypes.func,
    onRequestCloseExtensionLibrary: PropTypes.func,
    options: PropTypes.shape({
        media: PropTypes.string,
        zoom: PropTypes.shape({
            controls: PropTypes.bool,
            wheel: PropTypes.bool,
            startScale: PropTypes.number
        }),
        colours: PropTypes.shape({
            workspace: PropTypes.string,
            flyout: PropTypes.string,
            toolbox: PropTypes.string,
            toolboxSelected: PropTypes.string,
            scrollbar: PropTypes.string,
            scrollbarHover: PropTypes.string,
            insertionMarker: PropTypes.string,
            insertionMarkerOpacity: PropTypes.number,
            fieldShadow: PropTypes.string,
            dragShadowOpacity: PropTypes.number
        }),
        comments: PropTypes.bool,
        collapse: PropTypes.bool
    }),
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    toolboxXML: PropTypes.string,
    updateToolboxState: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

Blocks.defaultOptions = {
    zoom: {
        controls: true,
        wheel: true,
        startScale: 0.675
    },
    grid: {
        spacing: 40,
        length: 2,
        colour: '#ddd'
    },
    colours: {
        workspace: '#F9F9F9',
        flyout: '#F9F9F9',
        toolbox: '#FFFFFF',
        toolboxSelected: '#E9EEF2',
        scrollbar: '#CECDCE',
        scrollbarHover: '#CECDCE',
        insertionMarker: '#000000',
        insertionMarkerOpacity: 0.2,
        fieldShadow: 'rgba(255, 255, 255, 0.3)',
        dragShadowOpacity: 0.6
    },
    comments: true,
    collapse: false,
    sounds: false
};

Blocks.defaultProps = {
    isVisible: true,
    options: Blocks.defaultOptions
};

const mapStateToProps = state => ({                // jiang
    anyModalVisible: (
        Object.keys(state.scratchGui.modals).some(key => state.scratchGui.modals[key]) ||
        state.scratchGui.mode.isFullScreen
    ),
    extensionLibraryVisible: state.scratchGui.modals.extensionLibrary,
    locale: state.locales.locale,
    messages: state.locales.messages,
    toolboxXML: state.scratchGui.toolbox.toolboxXML,
    customProceduresVisible: state.scratchGui.customProcedures.active
});

const mapDispatchToProps = dispatch => ({
    onActivateColorPicker: callback => dispatch(activateColorPicker(callback)),
    onActivateCustomProcedures: (data, callback) => dispatch(activateCustomProcedures(data, callback)),
    onRequestCloseExtensionLibrary: () => {
        dispatch(closeExtensionLibrary());
    },
    onRequestCloseCustomProcedures: data => {
        dispatch(deactivateCustomProcedures(data));
    },
    updateToolboxState: toolboxXML => {
        dispatch(updateToolbox(toolboxXML));
    }
});

export default
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Blocks)
;
