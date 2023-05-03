// NodeJS & electron stuff

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ipc = ipcMain;

function createWindow () {
	const win = new BrowserWindow({
		width: 1250,
		height: 700,
		minWidth: 400,
		minHeight: 200,
		frame: false,
		titleBarStyle: 'hidden',
		show: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			preload: path.join(__dirname, 'preload.js')
		}
	});

	win.loadFile('index.html');
	win.setBackgroundColor('#000000');

	ipc.on('closeApp', () => {
		win.close();
	});
	ipc.on('maximizeApp', () => {
		win.maximize();
	});
	ipc.on('minimizeApp', () => {
		win.minimize();
	});

	win.maximize();
	win.show();
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	});
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
