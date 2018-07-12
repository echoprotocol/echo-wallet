import modalReducer from './ModalReducer';
import globalReducer from './GlobalReducer';
import formReducer from './FormReducer';

export default {
	modal: modalReducer.reducer,
	global: globalReducer.reducer,
	form: formReducer.reducer,
};
