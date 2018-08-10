import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { FORM_CALL_CONTRACT } from '../../../constants/FormConstants';

import { callMethod } from '../../../actions/CallContractActions';
import { clearForm } from '../../../actions/FormActions';

class ButtonComponent extends React.Component {

	componentDidMount() {
		this.props.clearForm();
	}

	onClick() {
		this.props.callMethod();
	}

	renderLoading() {
		return (<Button type="submit" color="orange" className="load">Creating...</Button>);
	}

	renderSubmit() {
		return (
			<div className="form-panel">
				<Button
					basic
					type="submit"
					color="orange"
					onClick={() => this.onClick()}
				>
                    Send
				</Button>
			</div>
		);
	}

	render() {
		const { loading } = this.props;

		return loading ? this.renderLoading() : this.renderSubmit();
	}

}

ButtonComponent.propTypes = {
	callMethod: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	loading: PropTypes.bool,
};

ButtonComponent.defaultProps = {
	loading: false,
};

export default connect(
	(state) => ({
		loading: state.form.getIn([FORM_CALL_CONTRACT, 'loading']),
	}),
	(dispatch) => ({
		callMethod: (value) => dispatch(callMethod(value)),
		clearForm: () => dispatch(clearForm(FORM_CALL_CONTRACT)),
	}),
)(ButtonComponent);
