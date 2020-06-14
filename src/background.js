import './background/settings';

const {
  app,
  protocol,
  BrowserWindow,
  ipcMain,
} = require('electron');

const {
  createProtocol,
  installVueDevtools,
} = require('vue-cli-plugin-electron-builder/lib');
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
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      experimentalFeatures: true,
    },
  }, 'main');

  mainWindowState.manage(mainWindow);
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
      await installVueDevtools();
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createMainWindow();
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

ipcMain.on('open-board', (e, form) => {
  const boardWindow = newWindow({
    width: 600,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true,
    },
  }, 'board/departures', true);

  boardWindow.webContents.on('did-finish-load', () => {
    boardWindow.webContents.send('board-data', form);
  });
});
