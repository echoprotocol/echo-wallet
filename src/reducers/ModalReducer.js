import { createModule } from 'redux-modules';
import { fromJS, Map } from 'immutable';

export default createModule({
	name: 'modal',
	initialState: Map({
		confirm: Map({
			show: false,
			title: '',
			text: '',
			btnYes: undefined,
			btnNo: undefined,
			callbackYes: () => {},
			callbackCancel: () => {},
		}),
	}),
	transformations: {
		showConfirm: {
			reducer: (state, { payload }) => (
				state.setIn('confirm', fromJS({
					show: true,
					title: payload.title,
					text: payload.text,
					btnYes: payload.btnYes,
					btnNo: payload.btnNo,
					callbackYes: payload.callbackYes,
					callbackCancel: payload.callbackCancel,
				}))
			),
		},

		closeConfirm: {
			reducer: (state) => {
				let newState = state.setIn(['confirm', 'show'], false);
				newState = newState.setIn(['confirm', 'callbackYes'], (() => {}));
				newState = newState.setIn(['confirm', 'callbackCancel'], (() => {}));
				return newState;
			},
		},
	},
});
