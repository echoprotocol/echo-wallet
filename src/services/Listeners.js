import Services from '.';
import GlobalReducer from '../reducers/GlobalReducer';
import { LOCAL_NODE } from '../constants/GlobalConstants';
import { requestActiveAccountAndDelegate } from '../actions/GlobalActions';

class Listeners {

	constructor() {
		this.emitter = Services.getEmitter();
	}


	initListeners(dispatch, getState) {
		this.setIsConnected = (status) => {
			dispatch(GlobalReducer.actions.set({ field: 'isConnected', value: status }));
			if (status) {
				Services.getEcho().api.getDynamicGlobalProperties(true);
			}
		};
		this.setCurrentNode = (value) => {
			const localNodeSyncing = value === LOCAL_NODE;
			dispatch(GlobalReducer.actions.set({ field: 'isNodeSyncing', value: localNodeSyncing }));
			dispatch(GlobalReducer.actions.set({ field: 'currentNode', value }));
			dispatch(requestActiveAccountAndDelegate());
		};
		this.setLocalNodePercent = (value) => {

			const state = getState();

			if (state.global.get('localNodePercent') !== value) {
				dispatch(GlobalReducer.actions.set({ field: 'localNodePercent', value }));
			}

		};
		this.setSyncOnPause = (value) => {
			console.warn(value);
			// dispatch(GlobalReducer.actions.set({ field: 'isNodePaused', value });
		};

		this.emitter.on('setIsConnected', this.setIsConnected);
		this.emitter.on('setCurrentNode', this.setCurrentNode);
		this.emitter.on('setLocalNodePercent', this.setLocalNodePercent);
		this.emitter.on('setSyncOnPause', this.setSyncOnPause);

	}

}

export default Listeners;
