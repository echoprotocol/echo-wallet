// Modules to control application life and create native browser window
const {
	app, BrowserWindow, Menu, ipcMain,
} = require('electron');

require('electron-context-menu')({
	labels: {
		cut: 'cut',
		copy: 'copy',
		paste: 'paste',
	},
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 760,
		minWidth: 1000,
		minHeight: 760,
		webPreferences: {
			nodeIntegration: false,
			preload: `${__dirname}/preload.js`,
		},
		frame: false,
	});

	// and load the index.html of the app.
	mainWindow.loadFile('build/index.html');

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	if (process.platform === 'darwin') {
		const template = [
			{
				label: 'Edit',
				submenu: [
					{ role: 'cut' },
					{ role: 'copy' },
					{ role: 'paste' },
					{ role: 'pasteandmatchstyle' },
					{ role: 'delete' },
					{ role: 'selectall' },
				],
			},
		];
		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);
	}

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	app.quit();
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('close-app', () => {
	app.quit();
});

ipcMain.on('max-app', () => {
	if (!mainWindow.isMaximized()) {
		mainWindow.maximize();
	} else {
		mainWindow.unmaximize();
	}
});

ipcMain.on('min-app', () => {
	mainWindow.minimize();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
