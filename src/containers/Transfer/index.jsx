import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';

import { FORM_TRANSFER } from '../../constants/FormConstants';
import { clearForm, setIn } from '../../actions/FormActions';
import { transfer, resetTransaction } from '../../actions/TransactionActions';

import AccountField from './AccountField';

import AmountField from '../../components/AmountField';
import NoteField from './NoteField';

class Transfer extends React.Component {

	componentDidMount() {
		const { accountName } = this.props;
		this.props.setIn('from', { value: accountName, checked: true });
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.accountName !== this.props.accountName;
	}

	componentWillUnmount() {
		this.props.clearForm();
		this.props.resetTransaction();
	}

	onSend() {
		this.props.transfer();
	}

	render() {
		return (
			<Form className="main-form">
				<div className="field-wrap">
					<AccountField subject="from" />
					<AccountField subject="to" autoFocus />
					<AmountField form={FORM_TRANSFER} />
					<NoteField />
					<div className="form-panel">
						<Button
							basic
							type="submit"
							className="main-btn"
							content="Send"
							onClick={(e) => this.onSend(e)}
						/>
					</div>
				</div>
			</Form>
		);
	}

}

Transfer.propTypes = {
	accountName: PropTypes.string.isRequired,
	clearForm: PropTypes.func.isRequired,
	transfer: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	setIn: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		accountName: state.global.getIn(['activeUser', 'name']),
	}),
	(dispatch) => ({
		clearForm: () => dispatch(clearForm(FORM_TRANSFER)),
		transfer: (params) => dispatch(transfer(params)),
		resetTransaction: () => dispatch(resetTransaction()),
		setIn: (field, param) => dispatch(setIn(FORM_TRANSFER, field, param)),
	}),
)(Transfer);
