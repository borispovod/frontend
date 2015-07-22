var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var globalShortcut = require('global-shortcut');
var dialog = require('dialog');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function () {
    // Create the browser window.

    console.log('Your app is ready!');
    // Register a 'ctrl+c' shortcut listener.
    var qsCopy = globalShortcut.register('CommandOrControl+c', function () {
        mainWindow.webContents.copy();
    })
    // Register a 'ctrl+v' shortcut listener.
    var qsPaste = globalShortcut.register('CommandOrControl+v', function () {
        mainWindow.webContents.paste();
    })
    // Register a 'ctrl+x' shortcut listener.
    var qsCut = globalShortcut.register('CommandOrControl+x', function () {
        mainWindow.webContents.cut();
    })

    mainWindow = new BrowserWindow({width: 1300, height: 800 , title: 'Crypti',

        icon: 'file://' + __dirname + '/coin.png'
    });

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/wallet.html');

    // Open the devtools.
    //mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    mainWindow.on('blur', function(){
        globalShortcut.unregisterAll();
    });

    mainWindow.on('focus', function () {
        // Register a 'ctrl+c' shortcut listener.
        var qsCopy = globalShortcut.register('CommandOrControl+c', function () {
            mainWindow.webContents.copy();
        })
        // Register a 'ctrl+v' shortcut listener.
        var qsPaste = globalShortcut.register('CommandOrControl+v', function () {
            mainWindow.webContents.paste()  ;
        })
        // Register a 'ctrl+x' shortcut listener.
        var qsCut = globalShortcut.register('CommandOrControl+x', function () {
            mainWindow.webContents.cut();
        })
    })
});