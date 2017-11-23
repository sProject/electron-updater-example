// This is free and unencumbered software released into the public domain.
// See LICENSE for details

const {app, BrowserWindow, Menu, protocol, ipcMain} = require('electron');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

//-------------------------------------------------------------------
// Define the menu
//
// THIS SECTION IS NOT REQUIRED
//-------------------------------------------------------------------
let template = []
if (process.platform === 'darwin') {
	// OS X
	const name = app.getName();
	template.unshift({
		label: name,
		submenu: [
			{
				label: 'About ' + name,
				role: 'about'
			},
			{
				label: 'Quit',
				accelerator: 'Command+Q',
				click() { app.quit(); }
			},
		]
	})
}


//-------------------------------------------------------------------
// Open a window that displays the version
//
// THIS SECTION IS NOT REQUIRED
//
// This isn't required for auto-updates to work, but it's easier
// for the app to show a window than to have to click "About" to see
// that updates are working.
//-------------------------------------------------------------------
let win;

function sendStatusToWindow(text) {
	log.info(text);
	win.webContents.send('message', text);
}
function createDefaultWindow() {
	console.log('createDefaultWindow');
	win = new BrowserWindow();
	win.webContents.openDevTools();
	win.on('closed', () => {
		win = null;
	});
	win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
	return win;
}

// ---------------
// autoupdate
// ---------------
autoUpdater.on('checking-for-update', () => {
	console.log('checking-for-update');
	sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
	console.log('update-available');
	sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
	console.log('update-not-available');
	sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
	console.log('error');
	sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
	console.log('download-progress');
	sendStatusToWindow('Download in progress...');
})
autoUpdater.on('update-downloaded', (info) => {
	console.log('update-downloaded');
	sendStatusToWindow('Update downloaded');
	setTimeout(() => autoUpdater.quitAndInstall(), 5000)
});
app.on('ready', function()  {
	console.info('autoUpdater.checkForUpdatesAndNotify();');
	autoUpdater.checkForUpdates();
});

// ---------------

app.on('ready', function() {
	console.log('ready');
	// Create the Menu
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);

	createDefaultWindow();
});
app.on('window-all-closed', () => {
	app.quit();
});

//
// CHOOSE one of the following options for Auto updates
//

//-------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//
// This will immediately download an update, then install when the
// app quits.
//-------------------------------------------------------------------
// app.on('ready', function()  {
// 	console.info('autoUpdater.checkForUpdatesAndNotify();');
// 	autoUpdater.checkForUpdatesAndNotify();
// });

//-------------------------------------------------------------------
// Auto updates - Option 2 - More control
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
// app.on('ready', function()  {
//   autoUpdater.checkForUpdates();
// });
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (info) => {
// })
// autoUpdater.on('update-not-available', (info) => {
// })
// autoUpdater.on('error', (err) => {
// })
// autoUpdater.on('download-progress', (progressObj) => {
// })
// autoUpdater.on('update-downloaded', (info) => {
//   autoUpdater.quitAndInstall();
// })
