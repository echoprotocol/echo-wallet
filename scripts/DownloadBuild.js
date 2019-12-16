import path from 'path';
import fs from 'fs';
import download from 'download';
import { parse } from 'url';
import tar from 'tar';
import config from 'config';

/**
 *
 * @param {String} url
 * @param {String} os
 * @param {String} filename
 */
const downloadBuild = async (url, os, filename) => {

	console.log(`[${os}] Downloading the build... ${url}`);

	const destination = `resources/${os}/bin`;

	const parsed = parse(url);
	const urlFilename = path.basename(parsed.pathname);
	const tarDestination = `${destination}/${urlFilename}`;

	if (fs.existsSync(url)) { // check local file
		fs.copyFileSync(url, `${destination}/${filename}`);
	} else {
		await download(url, destination);
	}

	const extractedFolder = urlFilename.split('.').slice(0, -1).join('.');

	console.log(`[${os}] Extracting to ${destination}/${extractedFolder}...`);

	await tar.x({
		file: tarDestination,
		C: `${destination}`,
	});

	const nodeFilePath = `${destination}/${extractedFolder}/${filename}`;

	console.log(`[${os}] Copying to ${destination}/${filename}...`);

	fs.copyFileSync(nodeFilePath, `${destination}/${filename}`);

	console.log(`[${os}] Setting permissions ${filename}...`);

	fs.chmodSync(`${destination}/${filename}`, 0o777);

	console.log(`[${os}] Done.`);

};

(async () => {

	try {

		const downloadOS = process.env.DOWNLOAD_ECHO_NODE_OS;

		const downloadUrl = process.env.DOWNLOAD_ECHO_NODE_URL || config.DOWNLOAD_ECHO_NODE_URLS[downloadOS.toUpperCase()];

		if (!downloadUrl) {
			throw new Error('You need to set process.env.DOWNLOAD_ECHO_NODE_URL');
		}

		if (!downloadOS) {
			throw new Error('You need to set process.env.DOWNLOAD_ECHO_NODE_OS');
		}

		await downloadBuild(downloadUrl, downloadOS, 'echo_node');


	} catch (e) {
		console.log(e);
		process.exit(1);
	}


})();
