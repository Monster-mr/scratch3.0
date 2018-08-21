import classNames from 'classnames';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {connect} from 'react-redux';
import MediaQuery from 'react-responsive';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import VM from '../../../scratch-vm';
import Renderer from 'scratch-render';

import Blocks from '../../containers/blocks.jsx';
import CostumeTab from '../../containers/costume-tab.jsx';
import TargetPane from '../../containers/target-pane.jsx';
import SoundTab from '../../containers/sound-tab.jsx';
import StageWrapper from '../../containers/stage-wrapper.jsx';
import Loader from '../loader/loader.jsx';
import Box from '../box/box.jsx';
import MenuBar from '../menu-bar/menu-bar.jsx';
import CostumeLibrary from '../../containers/costume-library.jsx';
import BackdropLibrary from '../../containers/backdrop-library.jsx';
import ArduinoPanel from '../../containers/arduino-panel.jsx';
import Popup from '../../containers/popup.jsx';

import Backpack from '../../containers/backpack.jsx';
import PreviewModal from '../../containers/preview-modal.jsx';
import ImportModal from '../../containers/import-modal.jsx';
import WebGlModal from '../../containers/webgl-modal.jsx';
import TipsLibrary from '../../containers/tips-library.jsx';
import Cards from '../../containers/cards.jsx';
import DragLayer from '../../containers/drag-layer.jsx';

import layout, {STAGE_SIZE_MODES} from '../../lib/layout-constants';
import {resolveStageSize} from '../../lib/screen-utils';

import styles from './gui.css';
import addExtensionIcon from './icon--extensions.svg';
import codeIcon from './icon--code.svg';
import costumesIcon from './icon--costumes.svg';
import soundsIcon from './icon--sounds.svg';
import defaultsDeep from "lodash.defaultsdeep";
const shapeFromPropTypes = require('../../lib/shape-from-prop-types');

const messages = defineMessages({
    addExtension: {
        id: 'gui.gui.addExtension',
        description: 'Button to add an extension in the target pane',
        defaultMessage: 'Add Extension'
    }
});

// Cache this value to only retrieve it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;

const GUIComponent = props => {
    const {
        activeTabIndex,
        basePath,
        backdropLibraryVisible,
        backpackOptions,
        blocksTabVisible,
        cardsVisible,
        children,
        costumeLibraryVisible,
        costumesTabVisible,
        enableCommunity,
        importInfoVisible,
        intl,
        isPlayerOnly,
        loading,
        onExtensionButtonClick,
        onActivateCostumesTab,
        onActivateSoundsTab,
        onActivateTab,
        onRequestCloseBackdropLibrary,
        onRequestCloseCostumeLibrary,
        onSeeCommunity,
        previewInfoVisible,
        targetIsStage,
        consoleMsg,
        code,
        editorCode,
        soundsTabVisible,
        stageSizeMode,
        tipsLibraryVisible,
        vm,
        kb,
        showArduinoPanel,
        toggleArduinoPanel,
        clearConsole,
        consoleSend,
        togglePopup,
        showPopups,
        blocksProps,
        serialDev,
        getInputValue,
        onChange,
        reloadPlay,
        ...componentProps
    } = omit(props, 'dispatch');


    // if (children) {
    //     return <Box {...componentProps}>{children}</Box>;
    // }

    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
        tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
    };

    if (isRendererSupported === null) {
        isRendererSupported = Renderer.isSupported();
    }
    return (<MediaQuery minWidth={layout.fullSizeMinWidth}>{isFullSize => {
        const stageSize = resolveStageSize(stageSizeMode, isFullSize);

        return isPlayerOnly ? (
            <StageWrapper
                isRendererSupported={isRendererSupported}
                stageSize={stageSize}
                vm={vm}
            />
        ) : (
            <Box
                className={styles.pageWrapper}
                {...componentProps}
            >
                {/*{previewInfoVisible ? (*/}
                    {/*<PreviewModal />*/}
                {/*) : null}*/}
                {loading ? (
                    <Loader />
                ) : null}
                {importInfoVisible ? (
                    <ImportModal />
                ) : null}

                {togglePopup ? (
                    <Popup showPopup={props.showPopups}
                    togglePopup={props.togglePopup}
                           getInputValue={props.getInputValue}
                           reloadPlay={props.reloadPlay}/>  //zbl 点击新建项目的传值
                ): null}
                {isRendererSupported ? null : (
                    <WebGlModal />
                )}
                {tipsLibraryVisible ? (
                    <TipsLibrary />
                ) : null}
                {cardsVisible ? (
                    <Cards />
                ) : null}
                {costumeLibraryVisible ? (
                    <CostumeLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseCostumeLibrary}
                    />
                ) : null}
                {backdropLibraryVisible ? (
                    <BackdropLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseBackdropLibrary}
                    />
                ) : null}
                <MenuBar
                    enableCommunity={enableCommunity}
                    onSeeCommunity={onSeeCommunity}
                    toggleArduinoPanel={toggleArduinoPanel}
                    togglePopup={togglePopup}
                    refreshPort={props.refreshPort}
                    selectPort={props.selectPort}
                    serialDev={serialDev}
                    connectedPort={props.connectedPort}
                    getInputValue={getInputValue}
                    onChange={onChange}
                    reloadPlay={reloadPlay}
                    UndoStack={props.UndoStack}
                />
                <Box className={styles.bodyWrapper}>
                    <Box className={styles.flexWrapper}>
                        <Box className={styles.editorWrapper}>
                            <Tabs
                                forceRenderTabPanel
                                className={tabClassNames.tabs}
                                selectedIndex={activeTabIndex}
                                selectedTabClassName={tabClassNames.tabSelected}
                                selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                                onSelect={onActivateTab}
                            >
                                <TabList className={tabClassNames.tabList}>
                                <Tab className={tabClassNames.tab}>
                                    <img
                                        draggable={false}
                                        src={codeIcon}
                                    />
                                    <FormattedMessage
                                        defaultMessage="Code"
                                        description="Button to get to the code panel"
                                        id="gui.gui.codeTab"
                                    />
                                </Tab>
                                <Tab
                                    className={tabClassNames.tab}
                                    onClick={onActivateCostumesTab}
                                >
                                    <img
                                        draggable={false}
                                        src={costumesIcon}
                                    />
                                    {targetIsStage ? (
                                        <FormattedMessage
                                            defaultMessage="Backdrops"
                                            description="Button to get to the backdrops panel"
                                            id="gui.gui.backdropsTab"
                                        />
                                    ) : (
                                        <FormattedMessage
                                            defaultMessage="Costumes"
                                            description="Button to get to the costumes panel"
                                            id="gui.gui.costumesTab"
                                        />
                                    )}
                                </Tab>
                                <Tab
                                    className={tabClassNames.tab}
                                    onClick={onActivateSoundsTab}
                                >
                                    <img
                                        draggable={false}
                                        src={soundsIcon}
                                    />
                                    <FormattedMessage
                                        defaultMessage="Sounds"
                                        description="Button to get to the sounds panel"
                                        id="gui.gui.soundsTab"
                                    />
                                </Tab>
                            </TabList>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    <Box className={styles.blocksWrapper}>
                                        {children[1]}
                                    </Box>
                                    <Box className={styles.extensionButtonContainer}>
                                        <button
                                            className={styles.extensionButton}
                                            title={intl.formatMessage(messages.addExtension)}
                                            onClick={onExtensionButtonClick}
                                        >
                                            <img
                                                className={styles.extensionButtonIcon}
                                                draggable={false}
                                                src={addExtensionIcon}
                                            />
                                        </button>
                                    </Box>
                                </TabPanel>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {costumesTabVisible ? <CostumeTab vm={vm} /> : null}
                                </TabPanel>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {soundsTabVisible ? <SoundTab vm={vm} /> : null}
                                </TabPanel>
                            </Tabs>
                            {backpackOptions.visible ? (
                                <Backpack host={backpackOptions.host} />
                            ) : null}
                        </Box>

                        <Box className={classNames(styles.stageAndTargetWrapper, styles[stageSize])}>
                            <StageWrapper
                                isRendererSupported={isRendererSupported}
                                stageSize={stageSize}
                                vm={vm}
                            />
                            <Box className={styles.targetWrapper}>
                                <TargetPane
                                    stageSize={stageSize}
                                    vm={vm}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <DragLayer />

                {children[0]}

            </Box>
        );
    }}</MediaQuery>);
};

GUIComponent.propTypes = {
   // blocksProps: shapeFromPropTypes(Blocks.propTypes, {omit: ['vm']}),//zbl8.6
    activeTabIndex: PropTypes.number,
    backdropLibraryVisible: PropTypes.bool,
    backpackOptions: PropTypes.shape({
        host: PropTypes.string,
        visible: PropTypes.bool
    }),
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    children: PropTypes.node,
    costumeLibraryVisible: PropTypes.bool,
    costumesTabVisible: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    importInfoVisible: PropTypes.bool,
    intl: intlShape.isRequired,
    isPlayerOnly: PropTypes.bool,
    loading: PropTypes.bool,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onRequestCloseBackdropLibrary: PropTypes.func,
    onRequestCloseCostumeLibrary: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onTabSelect: PropTypes.func,
    previewInfoVisible: PropTypes.bool,
    soundsTabVisible: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    targetIsStage: PropTypes.bool,
    tipsLibraryVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};
GUIComponent.defaultProps = {
    backpackOptions: {
        host: null,
        visible: false
    },
    basePath: './',
    blocksProps: {},
    stageSizeMode: STAGE_SIZE_MODES.large,
    vm: new VM()
};

const mapStateToProps = state => ({
    // This is the button's mode, as opposed to the actual current state
    stageSizeMode: state.scratchGui.stageSize.stageSize
});

export default injectIntl(connect(
    mapStateToProps
)(GUIComponent));
