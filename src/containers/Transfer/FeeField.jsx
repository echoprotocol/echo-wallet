import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Dropdown } from 'semantic-ui-react';
import { EchoJSActions } from 'echojs-redux';

import { FORM_TRANSFER } from '../../constants/FormConstants';
import formatAmount from '../../helpers/HistoryHelper';
import { setValue } from '../../actions/FormActions';
import { getFee } from '../../actions/TransactionActions';

class FeeComponent extends React.Component {

	componentDidMount() {
		this.props.loadGlobalObject();
	}

	shouldComponentUpdate(nextProps) {
		const { fee, comment, currency } = this.props;

		if (!fee.asset && nextProps.assets) { return true; }

		if (fee.value !== nextProps.fee.value) { return true; }

		if (fee.asset.id && nextProps.fee.asset.id) { return true; }

		if (comment.value !== nextProps.comment.value) { return true; }

		if (currency && currency.type !== nextProps.currency.type) { return true; }

		return false;
	}

	onFee(fee) {
		this.props.setValue('fee', fee);
	}

	getOptions() {
		const options = this.props.assets.map(({
			id, precision, symbol, type,
		}) => {
			const fee = this.props.getFee(
				type === 'tokens' ? 'contract' : 'transfer',
				id,
				this.props.comment.value,
			);

			return {
				key: symbol,
				value: fee ? fee.value : '',
				text: fee ? formatAmount(fee.value, precision, symbol) : '',
				onClick: (e) => this.onFee(fee, e),
			};
		});

		return options;
	}

	getText(options) {
		const { fee } = this.props;

		if (fee && fee.value) {
			return formatAmount(fee.value, fee.asset.precision, fee.asset.symbol);
		}

		return options[0] ? options[0].text : '';
	}

	render() {
		const options = this.getOptions();
		const text = this.getText(options);

		// TODO add styles for fee error
		return (
			<Form.Field>
				<label htmlFor="fee"> Fee </label>
				<Dropdown selection options={options} text={text} />
			</Form.Field>
		);
	}

}

FeeComponent.propTypes = {
	assets: PropTypes.any,
	fee: PropTypes.any,
	currency: PropTypes.any,
	comment: PropTypes.any.isRequired,
	setValue: PropTypes.func.isRequired,
	getFee: PropTypes.func.isRequired,
	loadGlobalObject: PropTypes.func.isRequired,
};

FeeComponent.defaultProps = {
	fee: null,
	assets: null,
	currency: null,
};

export default connect(
	(state) => ({
		assets: state.balance.get('assets').toArray(),
		fee: state.form.getIn([FORM_TRANSFER, 'fee']),
		comment: state.form.getIn([FORM_TRANSFER, 'comment']),
		currency: state.form.getIn([FORM_TRANSFER, 'currency']),
	}),
	(dispatch) => ({
		setValue: (field, value) => dispatch(setValue(FORM_TRANSFER, field, value)),
		loadGlobalObject: () => dispatch(EchoJSActions.fetch('2.0.0')),
		getFee: (operation, value, comment) => dispatch(getFee(operation, value, comment)),
	}),
)(FeeComponent);
