import Services from '.';
import GlobalReducer from '../reducers/GlobalReducer';

class Listeners {

	constructor() {
		this.emitter = Services.getEmitter();
	}


	initListeners(dispatch, getState) {
		this.setIsConnected = (status) => dispatch(GlobalReducer.actions.set({ field: 'isConnected', value: status }));
		this.setCurrentNode = (value) => dispatch(GlobalReducer.actions.set({ field: 'currentNode', value }));
		this.setLocalNodePercent = (value) => {

			const state = getState();

			if (state.global.get('localNodePercent') !== value) {
				dispatch(GlobalReducer.actions.set({ field: 'localNodePercent', value }));
			}

		};

		this.emitter.on('setIsConnected', this.setIsConnected);
		this.emitter.on('setCurrentNode', this.setCurrentNode);
		this.emitter.on('setLocalNodePercent', this.setLocalNodePercent);

	}

}

export default Listeners;
