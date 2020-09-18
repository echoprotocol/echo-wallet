import { dirname } from 'path';
import _spawn from 'cross-spawn';
import mkdirp from 'mkdirp';
import fs from 'fs';

import NodeFileEncryptor from '../src/services/node.file.encryptor';

class EchoNode {

	constructor() {
		this.child = null;
		this.stopInProcess = false;
	}

	/**
	 *
	 * @param {Object} params
	 * @param {Array} accounts
	 * @return {Promise.<*>}
	 */
	async start(params, accounts = [], chainToken, stopSyncing, execPath) {

		const binPath = `${execPath}/echo_node`;
		const keyConfigPath = `${params['data-dir']}/.key.config`;

		const fileExists = await new Promise((resolve) => {
			fs.exists(keyConfigPath, resolve);
		});

		let bytes = null;

		if (fileExists) {
			bytes = fs.readFileSync(keyConfigPath).toString('hex');
			fs.unlinkSync(keyConfigPath);
		}

		const oldMask = process.umask(0);
		await mkdirp(dirname(keyConfigPath), '0777');
		process.umask(oldMask);

		if (chainToken && chainToken.token) {
			const fileHex = NodeFileEncryptor.getFileBytes(chainToken.token, accounts);

			if (bytes !== fileHex) {
				try {
					await fs.writeFile(keyConfigPath, Buffer.from(fileHex, 'hex'), () => {});
				} catch (e) { /* eslint-disable-next-line no-empty */ }
			}
		}

		params['data-dir'] = `"${params['data-dir']}"`;
		const child = this.spawn(binPath, params, chainToken, stopSyncing);

		this.child = child;

		return child;
	}

	async stop() {
		return new Promise((resolve) => {

			this.stopInProcess = true;

			const { child } = this;

			if (!child) {
				return resolve(true);
			}

			if (child.exited) {
				return resolve();
			}

			child.then(() => {
				child.exited = true;
				this.child = null;
				return resolve();
			}).catch(() => {
				child.exited = true;
				this.child = null;
				return resolve();
			});

			if (!child.siginted) {
				child.siginted = true;
				child.kill('SIGINT');
			}

			return true;

		});
	}

	/**
	 *
	 * @param {Object} opts
	 * @return {Array}
	 */
	flags(opts = {}) {
		const args = [];

		/* eslint-disable no-restricted-syntax */
		for (const [key, value] of Object.entries(opts)) {
			if (key.toLowerCase() !== key) {
				throw Error('Options must be lowercase');
			}

			const arg = `--${key}${value === null ? '' : `=${value.toString()}`}`;
			args.push(arg);
		}

		return args;

	}

	/**
	 *
	 * @param {String} binPath
	 * @param {Object} opts
	 * @param {Object} chainToken
	 * @param {function} stopSyncing
	 * @return {*}
	 */
	spawn(binPath, opts, chainToken, stopSyncing) {

		const args = this.flags(opts);

		console.info(`spawning: echo_node ${args.join(' ')}`);

		const env = {};

		if (chainToken) {
			env.ECHO_KEY_PASSWORD = chainToken.token;
		}

		const start = Date.now();
		const child = _spawn(binPath, args, {
			detached: true,
			env,
		});

		child.started = true;

		child.unref();

		if (child.stdout) {
			child.stdout.pipe(process.stdout);
			child.stderr.pipe(process.stderr);
		}

		const promise = new Promise((resolve, reject) => {
			child.once('exit', (code) => {

				child.started = false;

				if (code !== 0) {
					let err;
					if (Date.now() - start < 1000) {
						const read = child.stderr.read();

						const stderr = read ? read.toString() : read;
						if (stderr) {
							err = Error(stderr);
						}
					} else {
						err = Error(`echo_node exited with code ${code}`);
					}
					return reject(err);
				}

				return resolve();
			});

			child.once('error', (err) => {
				child.started = false;
				stopSyncing(err);
				return reject();
			});
		});

		child.then = promise.then.bind(promise);
		child.catch = promise.catch.bind(promise);

		return child;
	}


}

export default EchoNode;
