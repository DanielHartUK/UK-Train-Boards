import Settings from './background/settings';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

const {
  app,
  protocol,
  BrowserWindow,
  ipcMain,
} = require('electron');

const { createProtocol } = require('vue-cli-plugin-electron-builder/lib');

require('./background/boardListeners');

const isDevelopment = process.env.NODE_ENV !== 'production';

const windowStateKeeper = require('electron-window-state');
const fs = require('fs');
// If it doesn't exist already, create the user data folder
const userDataPath = app.getPath('userData');

if (!fs.existsSync(userDataPath)) fs.mkdirSync(userDataPath);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

const windows = new Set();
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true,
  },
}]);

function newWindow(windowOptions, route = '', devTools = true) {
  const window = new BrowserWindow(windowOptions);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    window.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/${route}`);
    if (!process.env.IS_TEST && devTools) window.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    window.loadURL(`app://./index.html/#/${route}`);
  }
  window.on('closed', () => {
    windows.delete(window);
  });

  windows.add(window);

  return window;
}

function createMainWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 465,
    defaultHeight: 600,
  });
  // Create the browser window.
  const mainWindow = newWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      experimentalFeatures: true,
    },
  }, 'main');

  mainWindowState.manage(mainWindow);
}

function createBoard(form) {
  const boardWindow = newWindow({
    width: 342,
    height: 608,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true,
    },
    fullscreen: form.fullscreen,
  }, `board/${form.board}`, true);

  boardWindow.webContents.on('did-finish-load', () => {
    boardWindow.webContents.send('board-data', form);
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (windows.size === 0) {
    createMainWindow();
  }
});

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }

  const board = app.commandLine.getSwitchValue('board');

  if (board) {
    const form = { board };
    const location = app.commandLine.getSwitchValue('location');
    const page = app.commandLine.getSwitchValue('page') || 1;
    const fullscreen = app.commandLine.hasSwitch('fullscreen');

    if (!location) throw new Error('Location must be specified');

    form.location = location;
    form.page = parseInt(page, 10);
    form.fullscreen = fullscreen;
    createBoard(form);
  } else {
    createMainWindow();
  }
});

// Exit cleanly on request from parent process in development mode.

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

if (process.platform === 'win32') {
  app.setUserTasks([
    {
      program: process.execPath,
      arguments: '',
      iconPath: process.execPath,
      iconIndex: 0,
      title: 'New Board',
      description: 'Open the New Board screen',
    },
  ]);
}

ipcMain.on('open-board', (e, form) => {
  createBoard(form);
});

const nreApiKey = app.commandLine.getSwitchValue('nreApiKey');
if (nreApiKey) {
  Settings.setSettings({ nreApiKey })
    .then(() => {
      console.log('NRE API Key Set!');
    })
    .catch((e) => {
      console.error('Error setting NRE API Key: ', e);
    });
}
