const {
  app,
  BrowserWindow,
  Menu
} = require('electron')
const path = require('path')
const url = require('url')

var console_out = new require('console').Console(process.stdout, process.stderr);

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
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
          if (win.webContents.isDevToolsOpened()) {
            win.webContents.toggleDevTools();
          } else {
            win.webContents.openDevTools({mode:'undocked'});
          }
        },
        accelerator: 'Alt+T'
      },
      {type: 'separator'},
      {
        label: 'Exit',
        click() {
          app.quit();
        },
        accelerator: 'Alt+Q'
      }
    ]
  }]));

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true,
  }))

  win.on('ready-to-show', () => {
    win.show();
    //console_out.log(win.getContentSize());
  })

  //win.webContents.openDevTools()
}

app.whenReady().then(createWindow);
// app.whenReady().then(() => {
//   const win = new BrowserWindow({
//     //frame: false,
//     width: 400,
//     height: 300,
//     useContentSize: true,
//     webPreferences: {
//       nodeIntegration: true
//     },
//     resizable: false,
//     show: false,
//   })
//
//   // Menu.setApplicationMenu(Menu.buildFromTemplate([{
//   //   label: 'Menu',
//   //   submenu: [{
//   //       label: 'Toggle DevTools',
//   //       click() {
//   //         if (win.webContents.isDevToolsOpened()) {
//   //           win.webContents.toggleDevTools();
//   //         } else {
//   //           win.webContents.openDevTools({mode:'undocked'});
//   //         }
//   //       },
//   //       accelerator: 'Alt+T'
//   //     },
//   //     {type: 'separator'},
//   //     {
//   //       label: 'Exit',
//   //       click() {
//   //         app.quit();
//   //       },
//   //       accelerator: 'Alt+Q'
//   //     }
//   //   ]
//   // }]));
//   Menu.setApplicationMenu(null);
//
//   // and load the index.html of the app.
//   win.loadURL(url.format({
//     pathname: path.join(__dirname, 'src/index2.html'),
//     protocol: 'file:',
//     slashes: true,
//   }))
//
//   win.on('ready-to-show', () => {
//     win.show();
//     win.webContents.openDevTools({mode:'undocked'});
//     console_out.log(win.getContentSize());
//   })
// })

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

//Menu.setApplicationMenu(null)

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
