import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input } from 'semantic-ui-react';
import classnames from 'classnames';

import { FORM_TRANSFER } from '../../constants/FormConstants';
import { setIn, setValue } from '../../actions/FormActions';

import { checkAccount, fetchFee, updateFee } from '../../actions/TransactionActions';


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

		const value = e.target.value.toLowerCase().trim();
		const { note } = this.props;

		this.props.setIn('to', {
			loading: true,
			error: null,
			checked: false,
			value,
		});

		this.setState({
			timeout: setTimeout(async () => {

				if (await this.props.checkAccount(this.props.to.value) && note.value) {
					this.props.updateFee('transfer', note.value);
				} else {
					this.props.fetchFee('transfer').then((fee) => {
						this.props.setValue('fee', fee);
					});
				}
			}, 300),
		});

	}


	render() {
		const { to } = this.props;

		return (
			<Form.Field className={classnames('error-wrap', { error: to.error })}>

				<label htmlFor="accountTo">To</label>
				<Input type="text" placeholder="Account name" className={classnames('action-wrap', { loading: to.loading && !to.error })} autoFocus>
					<input
						name="accountTo"
						value={to.value}
						onInput={(e) => this.onInput(e)}
					/>
					{ to.checked && !to.error ? <span className="icon-checked_1 value-status" /> : null }
					{ to.error ? <span className="icon-error-red value-status" /> : null }
				</Input>
				<span className="error-message">{to.error}</span>

			</Form.Field>
		);
	}

}

ToAccountComponent.propTypes = {
	to: PropTypes.any.isRequired,
	checkAccount: PropTypes.func.isRequired,
	setIn: PropTypes.func.isRequired,
	fetchFee: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	updateFee: PropTypes.func.isRequired,
	note: PropTypes.any.isRequired,
};

export default connect(
	(state) => ({
		to: state.form.getIn([FORM_TRANSFER, 'to']),
		note: state.form.getIn(['transfer', 'note']) || {},
	}),
	(dispatch) => ({
		setValue: (field, value) => dispatch(setValue(FORM_TRANSFER, field, value)),
		setIn: (field, param) => dispatch(setIn(FORM_TRANSFER, field, param)),
		fetchFee: (type) => dispatch(fetchFee(type)),
		checkAccount: (value) => dispatch(checkAccount(value)),
		updateFee: (type, note) => dispatch(updateFee(type, note)),
	}),
)(ToAccountComponent);
