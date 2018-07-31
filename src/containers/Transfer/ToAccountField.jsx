import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input } from 'semantic-ui-react';
import classnames from 'classnames';

import { FORM_TRANSFER } from '../../constants/FormConstants';
import { setIn } from '../../actions/FormActions';
import { checkAccount } from '../../actions/TransactionActions';


class ToAccountComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			timeout: null,
		};
	}

	onInput(e) {
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}

		this.props.setIn('to', {
			loading: true,
			value: e.target.value.toLowerCase().trim(),
			error: null,
			checked: false,
		});

		this.setState({
			timeout: setTimeout(() => {
				this.props.checkAccount(this.props.to.value);
			}, 3 * 1000),
		});
	}

	render() {
		const { to } = this.props;

		return (
			<Form.Field>
				<label htmlFor="accountTo">To</label>
				<Input type="text" placeholder="Account name" className={classnames('action-wrap', { loading: to.loading, error: to.error })}>
					<input name="accountTo" value={to.value} onInput={(e) => this.onInput(e)} />
					{ to.checked ? <span className="icon-checked_1 value-status" /> : null }
					{ to.error ? <span className="icon-error_input value-status" /> : null }
					<span className="error-message">{to.error}</span>
				</Input>
			</Form.Field>
		);
	}

}

ToAccountComponent.propTypes = {
	to: PropTypes.any.isRequired,
	checkAccount: PropTypes.func.isRequired,
	setIn: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		to: state.form.getIn([FORM_TRANSFER, 'to']),
	}),
	(dispatch) => ({
		setIn: (field, param) => dispatch(setIn(FORM_TRANSFER, field, param)),
		checkAccount: (value) => dispatch(checkAccount(value)),
	}),
)(ToAccountComponent);
