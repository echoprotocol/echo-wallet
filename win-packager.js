const { createWindowsInstaller } = require('electron-winstaller');
const path = require('path');

const getInstallerConfig = () => {
	console.log('creating windows installer');

	const rootPath = path.join('./');
	const outPath = path.join(rootPath, 'dist');
	return Promise.resolve({
		appDirectory: path.join(outPath, 'inst/PixelPlex-app-win32-x64'),
		authors: 'PixelPlex',
		outputDirectory: path.join(outPath, 'installers'),
		exe: 'PixelPlex-app.exe',
		setupExe: 'echo-installer.exe',
	});
};

getInstallerConfig()
	.then(createWindowsInstaller)
	.catch((error) => {
		console.error(error.message || error);
		process.exit(1);
	});
