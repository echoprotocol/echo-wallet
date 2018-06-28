import modalReducer from './ModalReducer';
import globalReducer from './GlobalReducer';

export default {
	modal: modalReducer.reducer,
	global: globalReducer.reducer,
};
