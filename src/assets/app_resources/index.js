/* eslint-disable import/no-extraneous-dependencies */

import {
	app,
	BrowserWindow,
	shell,
	ipcMain,
	Menu,
} from 'electron';
import getPort from 'get-port';
import { xor } from 'lodash';
import notifier from 'node-notifier';
import rimraf from 'rimraf';
import { PrivateKey } from 'echojs-lib';
import { Subject, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import path from 'path';

import { WIN_PLATFORM } from '../../constants/PlatformConstants';

import {
	TIMEOUT_BEFORE_APP_PROCESS_EXITS_MS,
	DEFAULT_NETWORK_ID,
} from '../../constants/GlobalConstants';

import {
	DATA_DIR,
	CHAIN_MIN_RANGE_PORT,
	CHAIN_MAX_RANGE_PORT,
} from '../../constants/ChainConstants';

import getPlatform from '../../../main/GetPlatform';
import EchoNode from '../../../main/EchoNode';

require('electron-context-menu')({
	labels: {
		cut: 'cut',
		copy: 'copy',
		paste: 'paste',
	},
});

let mainWindow;
let quited = false;

let lastNode = null;
let restartTimer = null;

function createWindow() {
	mainWindow = new BrowserWindow({
		show: false,
		width: 1100,
		height: 800,
		minWidth: 1100,
		minHeight: 800,
		webPreferences: {
			nodeIntegration: false,
			preload: `${__dirname}/preload.js`,
		},
		frame: false,
		backgroundColor: '#5e79e8',
	});

	const buildPath = path.join(__dirname, '..');
	mainWindow.loadFile(`${buildPath}/index.html`);

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	mainWindow.webContents.on('new-window', (e, url) => {
		if (url !== mainWindow.webContents.getURL()) {
			e.preventDefault();
			shell.openExternal(url);
		}
	});

	const template = [
		{
			label: 'Edit',
			submenu: [
				{ role: 'undo' },
				{ role: 'redo' },
				{ type: 'separator' },
				{ role: 'cut' },
				{ role: 'copy' },
				{ role: 'paste' },
				{ role: 'pasteandmatchstyle' },
				{ role: 'delete' },
				{ role: 'selectall' },
			],
		},
		{
			label: 'View',
			submenu: [
				{ role: 'reload' },
				{ role: 'forcereload' },
				{ role: 'toggledevtools' },
				{ type: 'separator' },
				{ role: 'resetzoom' },
				{ role: 'zoomin' },
				{ role: 'zoomout' },
				{ type: 'separator' },
				{ role: 'togglefullscreen' },
			],
		},
		{
			role: 'window',
			submenu: [
				{ role: 'minimize' },
				{ role: 'close' },
			],
		},
		{
			role: 'help',
			submenu: [
				{
					label: 'Learn More',
					click() { shell.openExternal('https://myecho.app'); },
				},
			],
		},
	];
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);

	let rendererIsReady = false;
	let port = null;

	function sendPort() {
		if (port && rendererIsReady) {
			mainWindow.webContents.send('port', port);
		}
	}

	ipcMain.on('subscribePort', async () => {
		rendererIsReady = true;
		sendPort();
	});

	ipcMain.on('getPlatform', async () => {
		mainWindow.webContents.send('getPlatform', getPlatform());
	});

	let localEchoNodeNotified = false;

	ipcMain.on('setLanguage', async () => {

		if (!localEchoNodeNotified) {
			if (getPlatform() === WIN_PLATFORM) {
				notifier.notify({
					title: 'Echo Wallet',
					message: 'This version of the wallet does not support local Echo nodes on Windows OS. Your wallet will be connected to a remote node.',
				});
			} else {
				notifier.notify({
					title: 'Echo Wallet',
					message: 'You need to have an Echo account and log into the application to participate in block production.',
				});
			}

			localEchoNodeNotified = true;

		}

	});

	mainWindow.webContents.on('did-finish-load', async () => {

		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}

		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			mainWindow.focus();
		}

		port = await getPort({ port: getPort.makeRange(CHAIN_MIN_RANGE_PORT, CHAIN_MAX_RANGE_PORT) });

		sendPort();

		const subject = new Subject();
		let previousPublicKeys = [];
		let removeBeforeStart;
		let prevNetwork;

		function removeFolderAndRetrySyncNode(dataDir) {
			return new Promise((resolve) => {
				previousPublicKeys = [];
				lastNode = null;

				console.log('removeBeforeStart1', removeBeforeStart);
				if (removeBeforeStart) {
					removeBeforeStart = false;
					console.log('removeBeforeStart2');
					return rimraf(dataDir, () => resolve());
				}

				return resolve();
			});
		}

		subject.pipe(switchMap((data) => {
			const promise = data.lastNode ? data.lastNode.stop() : Promise.resolve();
			return from(promise.then(() => removeFolderAndRetrySyncNode(data.networkOptions['data-dir'])).then(() => ({
				networkOptions: data.networkOptions,
				accounts: data.accounts,
				chainToken: data.chainToken,
				networkId: data.networkId,
			})));
		})).subscribe((data) => {

			mainWindow.webContents.send('startEchoNode', { networkId: data.networkId });

			if (data.networkId === 'devnet') {
				return;
			}

			const pauseNodeSync = (value) => {
				mainWindow.webContents.send('pauseNodeSync', { message: value });
			};

			lastNode = new EchoNode();
			lastNode.start(
				data.networkOptions,
				data.accounts,
				data.chainToken,
				pauseNodeSync,
			).then(() => {
				if (!quited && !lastNode.stopInProcess) {
					removeBeforeStart = true;
				}
			}).catch(() => {
				if (!quited && !lastNode.stopInProcess) {
					removeBeforeStart = true;
				}
			});
		});

		ipcMain.on('startNode', async (_, args) => {

			const NETWORK_ID = args && args.networkId ? args.networkId : DEFAULT_NETWORK_ID;
			const chainToken = args && args.chainToken ? args.chainToken : null;

			const networkOptions = {
				'data-dir': `${app.getPath('userData')}/${DATA_DIR}/${NETWORK_ID}`.replace(/(\s+)/g, '%20'),
				'rpc-endpoint': `127.0.0.1:${port}`,
				// testnet: null,
				// 'replay-blockchain': null,
				// devnet: null,
				// 'seed-node': 'node1.devnet.echo-dev.io:6310',
			};

			switch (NETWORK_ID) {
				case 'testnet':
					networkOptions.testnet = null;
					break;
				case 'devnet':
					networkOptions.devnet = null;
					networkOptions['seed-node'] = 'node1.devnet.echo-dev.io:6310';
					break;
				default:

			}

			const accounts = args && args.accounts ? args.accounts : [];

			const receivedPublicKeys = accounts.map(({ key }) =>
				PrivateKey.fromWif(key).toPublicKey().toString());

			if (
				prevNetwork !== NETWORK_ID ||
				!lastNode ||
				previousPublicKeys.length !== receivedPublicKeys.length ||
				xor(receivedPublicKeys, previousPublicKeys).length
			) {
				subject.next({
					lastNode,
					networkOptions,
					accounts,
					chainToken,
					networkId: NETWORK_ID,
				});
				prevNetwork = NETWORK_ID;
			}

			previousPublicKeys = receivedPublicKeys;

		});

		ipcMain.on('stopNode', async () => {
			lastNode.stop();
		});

	});


}

app.on('before-quit', (event) => {

	quited = true;

	if (restartTimer) {
		clearTimeout(restartTimer);
		restartTimer = null;
	}

	console.log(`Caught before-quit. Exiting in ${TIMEOUT_BEFORE_APP_PROCESS_EXITS_MS} seconds.`);

	event.preventDefault();

	if (lastNode && lastNode.child) {
		lastNode.child.then(() => {
			process.exit(0);
		}).catch(() => {
			process.exit(0);
		});

		lastNode.stop();

		setTimeout(() => { process.exit(0); }, TIMEOUT_BEFORE_APP_PROCESS_EXITS_MS);

	} else {
		process.exit(0);
	}

});

app.on('ready', () => setTimeout(createWindow, 100));

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	} else {
		mainWindow.show();
	}
});

ipcMain.on('close-app', (event) => {
	if (!app.isQuiting) {
		event.preventDefault();
		mainWindow.hide();
	}
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


ipcMain.on('showWindow', () => {
	mainWindow.show();
});
