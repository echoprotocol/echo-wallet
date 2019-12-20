import appRootDir from 'app-root-dir';
import { join as joinPath, dirname } from 'path';
import _spawn from 'cross-spawn';
import mkdirp from 'mkdirp';
import fs from 'fs';

import getPlatform from './GetPlatform';
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
	async start(params, accounts = [], chainToken, stopSyncing) {

		const execPath = joinPath(process.cwd(), 'resources', 'bin');

		const binPath = `${joinPath(execPath, 'echo_node')}`;

		const keyConfigPath = `${params['data-dir']}/.key.config`;

		console.log(1);
		const fileExists = await new Promise((resolve) => {
			fs.stat(keyConfigPath, (err) => {
				if (err) {
					return resolve(false);
				}

				return resolve(true);

			});
		});

		console.log(2);
		let bytes = null;

		if (fileExists) {
			bytes = await new Promise((resolve, reject) => {
				fs.readFile(keyConfigPath, (err, data) => {
					if (err) {
						return reject(err);
					}

					return resolve(data.toString('hex'));
				});
			});

			console.log(3);
			await new Promise((resolve, reject) => {
				fs.unlink(keyConfigPath, (err) => {
					if (err) {
						return reject(err);
					}

					return resolve();
				});
			});

		}

		console.log(4);
		await mkdirp(dirname(keyConfigPath));

		console.log(5);
		if (chainToken && chainToken.token) {
			const fileHex = NodeFileEncryptor.getFileBytes(chainToken.token, accounts);

			console.log(6);
			if (bytes !== fileHex) {
				await new Promise((resolve, reject) => {
					fs.writeFile(keyConfigPath, Buffer.from(fileHex, 'hex'), (err) => {
						console.log('TUT1111', err);
						if (err) {
							return reject(err);
						}
						return resolve();
					});
				});
			}
		}
		console.log(7);

		params['data-dir'] = `"${params['data-dir']}"`;
		const child = this.spawn(binPath, params, chainToken, stopSyncing);

		console.log(8);
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
						err = Error(stderr);
					} else {
						err = Error(`echo_node exited with code ${code}`);
					}
					return reject(err);
				}

				return resolve();
			});

			child.once('error', () => {
				child.started = false;
				stopSyncing();
				return reject();
			});
		});

		child.then = promise.then.bind(promise);
		child.catch = promise.catch.bind(promise);

		return child;
	}


}

export default EchoNode;
