import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';

import { FORM_TRANSFER } from '../../constants/FormConstants';
import { clearForm, setIn } from '../../actions/FormActions';
import { transfer, resetTransaction } from '../../actions/TransactionActions';

import TransactionScenario from '../TransactionScenario';

import AccountField from './AccountField';
import AmountField from '../../components/AmountField';

class Transfer extends React.Component {

	componentDidMount() {
		const { accountName } = this.props;
		this.props.setIn('from', { value: accountName, checked: true });
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.accountName !== this.props.accountName
			|| nextProps.externalAccountId !== this.props.externalAccountId;
	}

	componentWillUnmount() {
		this.props.clearForm();
		this.props.resetTransaction();
	}

	render() {
		const { externalAccountId } = this.props;
		return (
			<TransactionScenario
				handleTransaction={() => this.props.transfer()}
				externalAccountId={externalAccountId}
			>
				{
					(submit) => (
						<Form className="main-form">
							<div className="field-wrap">
								<AccountField subject="from" />
								<AccountField subject="to" autoFocus />
								<AmountField form={FORM_TRANSFER} />
								<div className="form-panel">
									<Button
										basic
										type="submit"
										className="main-btn"
										content="Send"
										onClick={submit}
									/>
								</div>
							</div>
						</Form>
					)
				}
			</TransactionScenario>
		);
	}

}

Transfer.propTypes = {
	accountName: PropTypes.string.isRequired,
	clearForm: PropTypes.func.isRequired,
	transfer: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	setIn: PropTypes.func.isRequired,
	externalAccountId: PropTypes.string,
};

Transfer.defaultProps = {
	externalAccountId: '',
};

export default connect(
	(state) => ({
		accountName: state.global.getIn(['activeUser', 'name']),
		externalAccountId: state.form.getIn([FORM_TRANSFER, 'externalAccountId']),
	}),
	(dispatch) => ({
		clearForm: () => dispatch(clearForm(FORM_TRANSFER)),
		transfer: () => dispatch(transfer()),
		resetTransaction: () => dispatch(resetTransaction()),
		setIn: (field, param) => dispatch(setIn(FORM_TRANSFER, field, param)),
	}),
)(Transfer);
