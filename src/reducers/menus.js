const OPEN_MENU = 'scratch-gui/menus/OPEN_MENU';
const CLOSE_MENU = 'scratch-gui/menus/CLOSE_MENU';

const MENU_FILE = 'fileMenu';
const MENU_HARDWAER = 'hardwareMenu';  //wlq
const MENU_CONNECT = 'connectMenu';   //wlq
const MENU_EDIT = 'editMenu';
const MENU_LANGUAGE = 'languageMenu';


const initialState = {
    [MENU_FILE]: false,
    [MENU_EDIT]: false,
    [MENU_HARDWAER]: false, //wlq
    [MENU_CONNECT]: false,   //wlq
    [MENU_LANGUAGE]: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case OPEN_MENU:
        return Object.assign({}, state, {
            [action.menu]: true
        });
    case CLOSE_MENU:
        return Object.assign({}, state, {
            [action.menu]: false
        });
    default:
        return state;
    }
};
const openMenu = menu => ({
    type: OPEN_MENU,
    menu: menu
});
const closeMenu = menu => ({
    type: CLOSE_MENU,
    menu: menu
});
const openFileMenu = () => openMenu(MENU_FILE);
const closeFileMenu = () => closeMenu(MENU_FILE);
const fileMenuOpen = state => state.scratchGui.menus[MENU_FILE];// 文件框

const openHardwareMenu = () => openMenu(MENU_HARDWAER);
const closeHardwareMenu = () => closeMenu(MENU_HARDWAER);
const hardwareMenuOpen = state => state.scratchGui.menus[MENU_HARDWAER];// 硬件框

const openConnectMenu = () => openMenu(MENU_CONNECT);
const closeConnectMenu = () => closeMenu(MENU_CONNECT);
const connectMenuOpen = state => state.scratchGui.menus[MENU_CONNECT];// 硬件框

const openEditMenu = () => openMenu(MENU_EDIT);
const closeEditMenu = () => closeMenu(MENU_EDIT);
const editMenuOpen = state => state.scratchGui.menus[MENU_EDIT]; //修订框

const openLanguageMenu = () => openMenu(MENU_LANGUAGE);
const closeLanguageMenu = () => closeMenu(MENU_LANGUAGE);
const languageMenuOpen = state => state.scratchGui.menus[MENU_LANGUAGE];

export {
    reducer as default,
    initialState as menuInitialState,

    openHardwareMenu,
    closeHardwareMenu,
    hardwareMenuOpen,

    openConnectMenu,
    closeConnectMenu,
    connectMenuOpen,

    openFileMenu,
    closeFileMenu,
    openEditMenu,
    closeEditMenu,
    openLanguageMenu,
    closeLanguageMenu,
    fileMenuOpen,
    editMenuOpen,
    languageMenuOpen
};
