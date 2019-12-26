/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import { Echo, constants } from 'echojs-lib';
import {
	CONNECTION_TIMEOUT,
	MAX_RETRIES,
	PING_INTERVAL,
	PING_TIMEOUT,
	DISCONNECT_STATUS,
	REMOTE_NODE,
	LOCAL_NODE,
	CONNECT_STATUS,
	REGISTRATION,
} from '../constants/GlobalConstants';
import {
	SYNC_MONITOR_MS,
	RESTART_TIME_CHECKING_NODE_MS,
	SUPPORTED_LOCAL_NODE_NETWORKS,
} from '../constants/ChainConstants';

let ipcRenderer;

try {
	({ ipcRenderer } = window);
} catch (e) {
	console.log('Err electron import');
}

class Blockchain {

	/**
	 *  @constructor
	 *
	 *  Init nodes, api, store
	 */
	constructor(emitter) {
		this.current = '';
		this.network = '';
		this.remote = null;
		this.local = null;
		this.api = null;
		this.emitter = emitter;
		this.isOnline = window.navigator.onLine;
		this.isRemoteConnected = false;
		this.isLocalConnected = false;
		this.localNodeUrl = false;
		this.remoteInited = false;
		this.store = null;
		this.localNodePercent = 0;
		this.localNodeDiffSyncTime = 10e9;
		this.timeoutRemoteRecconect = null;
		this.timeoutLocalRecconect = null;


		this.localBlockNumber = 0;
		this.remoteBlockNumber = 0;
	}

	/**
	 * @readonly
	 * @type {boolean}
	 */
	get isConnected() {
		if (!this.isOnline) {
			return false;
		}

		if (this.current === REMOTE_NODE) {
			return this.isRemoteConnected;
		}

		if (this.current === LOCAL_NODE) {
			return this.isLocalConnected;
		}

		return false;

	}

	async checkSwitching() {

		if (
			this.isOnline &&
			this.isLocalConnected &&
			this.remoteBlockNumber > 0 &&
			this.localBlockNumber >= this.remoteBlockNumber - 1
		) {

			if (this.isLocalConnected) {
				await this.switchToLocal();
			}

		} else if (this.isRemoteConnected) {
			await this.switchToRemote();
		}

		console.info(`[BLOCKCHAIN] Check switching. Current: ${this.current}. Connected ${this.isConnected}. isOnline: ${this.isOnline}. isLocalConnected: ${this.isLocalConnected}. isRemoteConnected: ${this.isRemoteConnected}`);
	}


	updateOnlineStatus(status) {

		console.info('INTERNET CONNECTION STATUS', status.type);

		this.isOnline = status.type === 'online';

		if (this.isOnline) {

			if (!this.remote) {
				this.startCheckingRemote();
			}

			if (!this.local) {
				this.startCheckingLocalNode();
			}

		}

		this.notifyLocalNodePercent();

	}

	/**
	 *
	 * @param network
	 * @param store
	 * @returns {Promise<void>}
	 */
	async init(network, store) {

		this.store = store;

		window.addEventListener('online', this.updateOnlineStatus.bind(this));
		window.addEventListener('offline', this.updateOnlineStatus.bind(this));


		if (this.remote || this.local) {
			throw new Error('Instance already initialized');
		}

		try {

			this.setNetworkGroup(network);

			if (ipcRenderer) {

				ipcRenderer.on('port', async (_, port) => {
					this.localNodeUrl = `ws://127.0.0.1:${port}`;

					if (this.isOnline) {
						await this.startCheckingLocalNode();
					}

					this.emitter.emit('setIsConnected', this.isConnected);
				});

				ipcRenderer.send('subscribePort');

				ipcRenderer.on('startEchoNode', (_, data) => {

					if (this.networkId !== data.networkId) {
						this.remoteBlockNumber = 0;
						this.localBlockNumber = 0;
						this.notifyLocalNodePercent();
					}

					this.networkId = data.networkId;
				});

				ipcRenderer.on('pauseNodeSync', (_, data) => {
					this.emitter.emit('setSyncOnPause', data);
				});
			}

			await this.startCheckingRemote();

			this.emitter.emit('setIsConnected', this.isConnected);

		} catch (e) {
			console.error('init error', e);
		}

	}

	/**
	 *
	 * @param {string} node
	 */
	async setBlockNumber(node) {
		try {

			const globalObject = await this[node].api.getObject(constants.DYNAMIC_GLOBAL_OBJECT_ID, true);

			if (globalObject && globalObject.head_block_number) {
				this[`${node}BlockNumber`] = globalObject.head_block_number;
			}

		} catch (e) {
			console.warn(`${node} checkNodeSync error`, e);
		}
	}

	async checkNodeSync() {
		if (!this.local || !this.remote) {
			return;
		}

		await this.setBlockNumber('remote');
		await this.setBlockNumber('local');

		this.notifyLocalNodePercent();

		this.checkSwitching();

	}

	notifyLocalNodePercent() {
		const percent = this.remoteBlockNumber && this.localBlockNumber ?
			(this.localBlockNumber / this.remoteBlockNumber) * 100 : 0;

		console.log('percent', percent, 'localBlockNumber', this.localBlockNumber, 'remoteBlockNumber', this.remoteBlockNumber);

		this.emitter.emit('setLocalNodePercent', Math.min(percent, 100));
	}

	switchToLocal() {

		if (!this.local || this.current === LOCAL_NODE) {
			return false;
		}

		if (this.switching) {
			return console.warn('[NODES] SWITCHING to local');
		}

		this.switching = true;
		this._copyCacheToLocal();
		this.local.subscriber._clearSubscribers();
		this.local.subscriber.subscribers = this.remote.subscriber.subscribers;

		if (this.remote) {
			this.remote.cache.removeRedux();
		}

		this.local.cache.redux.store = this.store.store ? this.store.store : this.store;

		this.current = LOCAL_NODE;
		this.emitter.emit('setCurrentNode', LOCAL_NODE);
		this.switching = false;
		this.local.subscriber._subscribeCache();

		this._overrideApi(this.local);

		console.info(`[BLOCKCHAIN] SET CURRENT NODE: ${LOCAL_NODE}`);

		return true;
	}

	switchToRemote() {

		if (!this.remote || this.current === REMOTE_NODE) {
			return false;
		}

		if (this.switching) {
			return console.log('[NODES] SWITCHING to remote');
		}

		this.switching = true;

		this._copyCacheToRemote();
		this.remote.subscriber._clearSubscribers();
		this.remote.subscriber.subscribers = this.local.subscriber.subscribers;

		if (this.local) {
			this.local.cache.removeRedux();
		}

		this.remote.cache.redux.store = this.store.store ? this.store.store : this.store;

		this.current = REMOTE_NODE;
		this.emitter.emit('setCurrentNode', REMOTE_NODE);
		this.remote.subscriber._subscribeCache();
		this.switching = false;

		this._overrideApi(this.remote);

		console.info(`[BLOCKCHAIN] SET CURRENT NODE: ${REMOTE_NODE}`);

		return true;
	}

	/**
	 * @method _overrideApi
	 * @param {Object} node
	 */
	_overrideApi(node) {
		this.api = node.api;
		this.api.createTransaction = node.createTransaction.bind(node);
	}

	async startCheckingRemote() {

		if (!this.isOnline) {
			console.info('[REMOTE NODE] Offline');
			return false;
		}

		if (this.remoteInited) {
			console.info('[REMOTE NODE] inited');
			return false;
		}

		if (this.remoteConnecting) {
			console.info('[REMOTE NODE] connecting');
			return false;
		}

		this.remoteConnecting = true;

		try {

			if (this.timeoutRemoteRecconect) {
				clearTimeout(this.timeoutRemoteRecconect);
			}

			await this._remoteStart();

		} catch (e) {
			console.warn('[REMOTE NODE] Error ', e);
			this.timeoutRemoteRecconect = setTimeout(() => {
				this.startCheckingRemote();
			}, RESTART_TIME_CHECKING_NODE_MS);
		}

		this.remoteConnecting = false;

		return true;
	}

	startSyncMonitor() {
		setInterval(async () => {
			this.checkNodeSync();
		}, SYNC_MONITOR_MS);
	}

	async startCheckingLocalNode() {

		if (!this.isOnline) {
			console.log('[LOCAL NODE] Offline');
			return false;
		}

		if (!this.localNodeUrl) {
			console.log('[LOCAL NODE] URL is empty');
			return false;
		}

		if (this.localConnecting) {
			console.log('[LOCAL NODE] connecting');
			return false;
		}

		this.localConnecting = true;

		const url = this.localNodeUrl;

		try {

			if (this.timeoutLocalRecconect) {
				clearTimeout(this.timeoutLocalRecconect);
			}

			await this._localStart();

			this.startSyncMonitor();

		} catch (e) {

			console.warn(e);

			this.timeoutLocalRecconect = setTimeout(() => {
				this.startCheckingLocalNode(url);
			}, RESTART_TIME_CHECKING_NODE_MS);
		}

		this.localConnecting = false;

		return true;
	}

	setNetworkGroup(network) {
		this.network = network;
	}

	async _createConnection(url) {

		const instance = new Echo();

		await instance.connect(url, {
			connectionTimeout: CONNECTION_TIMEOUT,
			maxRetries: MAX_RETRIES,
			pingTimeout: PING_TIMEOUT,
			pingInterval: PING_INTERVAL,
			debug: false,
			apis: [
				'database',
				'network_broadcast',
				'history',
				'registration',
				// 'asset',
				'login',
				// 'network_node',
			],
			registration: { batch: REGISTRATION.BATCH, timeout: REGISTRATION.TIMEOUT },
		});

		return instance;
	}

	async _localStart() {
		if (!SUPPORTED_LOCAL_NODE_NETWORKS.some((n) => n === this.network) ||
			!JSON.parse(localStorage.getItem('isNodeSyncing'))) {
			throw new Error('Local node not allow to connect now');
		}
		// TODO:: local switch  unsubscribe previous!!
		this.local = await this._createConnection(this.localNodeUrl);

		console.info('[LOCAL NODE] Connected');

		// this.local.cache.setStore(this.store);

		this.local.subscriber.setStatusSubscribe(DISCONNECT_STATUS, () => {
			this.emitter.emit('setIsConnected', false);
			this.isLocalConnected = false;
			this.checkSwitching();
		});

		this.local.subscriber.setStatusSubscribe(CONNECT_STATUS, () => {
			this.emitter.emit('setIsConnected', true);
			this.isLocalConnected = true;
			this.checkSwitching();
		});

		this.isLocalConnected = true;

		this.checkSwitching();
	}

	async _remoteStart() {

		// TODO:: remote switch  unsubscribe previous!!

		this.remote = await this._createConnection(
			NETWORKS[this.network][REMOTE_NODE].url,
			{ pingInterval: PING_INTERVAL, pingTimeout: PING_TIMEOUT },
		);

		this.remote.cache.setStore(this.store);

		console.info('[REMOTE NODE] Connected');

		this.current = REMOTE_NODE;
		this._overrideApi(this.remote);

		this.remote.subscriber.setStatusSubscribe(DISCONNECT_STATUS, () => {
			this.emitter.emit('setIsConnected', false);
			this.isRemoteConnected = false;
			this.checkSwitching();
		});

		this.remote.subscriber.setStatusSubscribe(CONNECT_STATUS, () => {
			this.emitter.emit('setIsConnected', true);
			this.isRemoteConnected = true;
			this.checkSwitching();
		});
		this.isRemoteConnected = true;
		this.checkSwitching();

	}

	_copyCacheToLocal() {

		if (!this.remote || !this.remote.cache) {
			return null;
		}

		const cacheRemote = this.remote.cache;

		Object.values(constants.CACHE_MAPS).forEach((key) => {
			const value = cacheRemote[key];
			if (this.local.cache[key] && this.local.cache[key].equals) {
				if (!this.local.cache[key].equals(value)) {
					this.local.cache[key] = value;
				}
			} else if (this.local.cache[key] !== value) {
				this.local.cache[key] = value;
			}
		});

		return null;
	}

	_copyCacheToRemote() {

		if (!this.local || !this.local.cache) {
			return null;
		}

		const cacheLocal = this.local.cache;
		Object.values(constants.CACHE_MAPS).forEach((key) => {

			const value = cacheLocal[key];

			if (this.remote.cache[key] && this.remote.cache[key].equals) {
				if (!this.remote.cache[key].equals(value)) {
					this.remote.cache[key] = value;
				}
			} else if (this.remote.cache[key] !== value) {
				this.remote.cache[key] = value;
			}
		});

		return null;
	}

	/**
	 *
	 * @param {Array} accounts
	 * @param {String} networkId
	 * @param {Object} chainToken
	 * @return {boolean}
	 */
	setOptions(accounts = [], networkId, chainToken) {

		if (!ipcRenderer) {
			return false;
		}

		ipcRenderer.send('startNode', { accounts, networkId, chainToken });

		return true;
	}

	/**
	 * @method stopNode
	 */
	stopNode() {
		ipcRenderer.send('stopNode');
	}

	/**
	*
	* @param network
	* @returns {Promise<void>}
	*/
	async changeConnection(network) {
		if (this.remote) {
			this.remote.disconnect();
		}
		try {

			this.setNetworkGroup(network);

			if (this.localNodeUrl) {
				if (this.isOnline) {
					await this.startCheckingLocalNode();
				}

				this.emitter.emit('setIsConnected', this.isConnected);
			}

			await this.startCheckingRemote();
			this.emitter.emit('setIsConnected', this.isConnected);
		} catch (e) {
			console.error('change connection error', e);
		}
	}

	/**
	 * @method getEchoInstance
	 * @returns {*}
	 */
	getEchoInstance() {
		return this[this.current];
	}

}

export default Blockchain;
