const { app, BrowserWindow, Menu, MenuItem, ipcMain } = require('electron')
const util = require('./utils.js')

// Create a new menu.
const menu = new Menu()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let logo

// Disable Electron Security Warnings which
// only show up when the binary's name is Electron,
// indicating that a developer is currently looking at the console.
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// Load Bible files.
var fs = require('fs')
//var files = fs.readdirSync('./bibles/').sort()
var files = ['CUVMPS.json']
var bible = new Array()
for (var i = 0; i < files.length; i++) {
  file = './bibles/'.concat(files[i])
  if (file.search(/\.json$/i) > -1) {
    try {
      var text = require(file)
      bible.push(text)
    } catch(err) {
      console.log(err)
    }
  }

}

// Load window state.
var state = util.load('state',{'max':false})
var initState = JSON.parse(JSON.stringify(state));

function createWindow () {

  logo = new BrowserWindow({
    width: 500,
    height: 500,
    center: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    alwaysOnTop: true,
    fullscreenable: false,
    skipTaskbar: true,
    frame: false,
    transparent: true,
    show: true
  })
  logo.setMenu(null)
  logo.loadFile('logo.html')

  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 576,
    minWidth: 1024,
    minHeight: 576,
    frame: false,
    show: false,
    icon: 'images/bible.png',
    webPreferences: {
      nodeIntegration: true
    }
  })

  let contents = win.webContents

  contents.on('did-finish-load', () => {
    contents.send('sendBible',bible)
  })

  // Showing the window after the renderer process has rendered the page.
  ipcMain.on('closeLogo', () => {
    logo.destroy()
    if (initState.hasOwnProperty('bounds')) win.setBounds(initState.bounds)
    if (initState.max) win.maximize()
    win.show()
  })

  // Update window state
  win.on('maximize', () => {
    contents.executeJavaScript("document.getElementById('max').innerHTML = '&#128471;'")
    updateState(false)
  })
  win.on('unmaximize', () => {
    contents.executeJavaScript("document.getElementById('max').innerHTML = '&#128470;'")
    updateState(false)
  })
  win.on('resize', () => {
    if (!win.isMaximized() && !win.isMinimized()) updateState(true)
  })
  win.on('move', () => {
    if (!win.isMaximized() && !win.isMinimized()) updateState(true)
  })

  // Replace the default menu.
  menu.append(new MenuItem({
    label: 'Developer Tools',
    accelerator: 'CmdOrCtrl+D',
    click: () => { win.webContents.toggleDevTools() }
  }))
  win.setMenu(menu)

  // Load the index.html of the app.
  win.loadFile('index.html')

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

function updateState (b) {
  state.max = win.isMaximized()
  if (b) state.bounds = win.getBounds()
  util.save('state',state)
}