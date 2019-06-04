import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input } from 'semantic-ui-react';
import classnames from 'classnames';

import { FORM_TRANSFER } from '../../constants/FormConstants';
import { setIn } from '../../actions/FormActions';
import { checkAccount, fetchFee, updateFee } from '../../actions/TransactionActions';

class AccountComponent extends React.Component {

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

		const value = e.target.value.toLowerCase().trim();
		this.props.setIn({
			loading: true,
			error: null,
			checked: false,
			value,
		});

		this.setState({
			timeout: setTimeout(async () => {
				if (
					(await this.props.checkAccount(this.props.field.value, this.props.subject)) &&
					this.props.note.value
				) {
					this.props.updateFee('transfer', this.props.note.value);
				} else {
					this.props.fetchFee('transfer');
				}
			}, 300),
		});
	}

	render() {
		const { field, autoFocus, subject } = this.props;

		return (
			<Form.Field className={classnames('error-wrap', { error: field.error })}>

				<label htmlFor={`account${subject}`}>{subject}</label>
				<Input type="text" placeholder="Account name" className={classnames('action-wrap', { loading: field.loading && !field.error })} autoFocus={autoFocus}>
					<input name={`account${subject}`} value={field.value} onInput={(e) => this.onInput(e)} />
					{ field.checked && !field.error &&
						<span className={classnames('icon-checked value-status', { success: field.checked })} />
					}
					{ field.error ? <span className="icon-error-red value-status" /> : null }
				</Input>
				<span className="error-message">{field.error}</span>

			</Form.Field>
		);
	}

}

AccountComponent.propTypes = {
	subject: PropTypes.any.isRequired,
	autoFocus: PropTypes.bool,
	field: PropTypes.any.isRequired,
	checkAccount: PropTypes.func.isRequired,
	setIn: PropTypes.func.isRequired,
	updateFee: PropTypes.func.isRequired,
	fetchFee: PropTypes.func.isRequired,
	note: PropTypes.any.isRequired,
};

AccountComponent.defaultProps = {
	autoFocus: false,
};

export default connect(
	(state, props) => ({
		field: state.form.getIn([FORM_TRANSFER, props.subject]),
		note: state.form.getIn(['transfer', 'note']) || {},
	}),
	(dispatch, props) => ({
		setIn: (param) => dispatch(setIn(FORM_TRANSFER, props.subject, param)),
		checkAccount: (value) => dispatch(checkAccount(value, props.subject)),
		fetchFee: (type) => dispatch(fetchFee(FORM_TRANSFER, type)),
		updateFee: (type, note) => dispatch(updateFee(type, note)),
	}),
)(AccountComponent);
