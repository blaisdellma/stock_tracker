const {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} = require('electron')
const path = require('path')
const url = require('url')

var console_out = new require('console').Console(process.stdout, process.stderr);

app.whenReady().then(() => {

  const mainWin = new BrowserWindow({
    frame: false,
    transparent: true,
    width: 610,
    height: 390,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    },
    resizable: false,
    show: false,
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate([{
    label: 'Menu',
    submenu: [{
        label: 'Credits'
      },
      {
        label: 'Toggle DevTools',
        click() {
          if (BrowserWindow.getFocusedWindow().webContents.isDevToolsOpened()) {
            BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
          } else {
            BrowserWindow.getFocusedWindow().webContents.openDevTools({
              mode: 'undocked'
            });
          }
        },
        accelerator: 'Alt+T'
      },
      {
        type: 'separator'
      },
      {
        label: 'Exit',
        click() {
          app.quit();
        },
        accelerator: 'Alt+Q'
      }
    ]
  }]));

  mainWin.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true,
  }))

  mainWin.on('ready-to-show', () => {
    mainWin.show();
  })

  const creditsWin = new BrowserWindow({
    frame: false,
    transparent: true,
    modal: true,
    parent: mainWin,
    width: 300,
    height: 300,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    },
    resizable: false,
    show: false,
  })

  creditsWin.loadURL(url.format({
    pathname: path.join(__dirname, 'src/credits.html'),
    protocol: 'file:',
    slashes: true,
  }))

  creditsWin.on('ready-to-show', () => {
    ipcMain.on('openCredits', (event, arg) => {
      console_out.log('openCredits');
      creditsWin.show();
    })

    ipcMain.on('hideCredits', (event, arg) => {
      console_out.log('hideCredits');
      creditsWin.hide();
      mainWin.focus();
    })
  })

  ipcMain.on('closeWindow', (event, arg) => {
    mainWin.close();
  })

});

// Not sure if code below from Electron boilerplate is necessary, but I'm keeping it

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
