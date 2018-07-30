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

	componentWillMount() {
		this.props.loadGlobalObject();
	}

	componentDidUpdate() {
		if (this.props.assets.length && !this.props.fee.value) {
			const fee = this.props.getFee(this.props.assets[0].id);
			this.props.setValue('fee', fee);
		}
	}

	onFee(fee) {
		this.props.setValue('fee', fee);
	}

	getOptions() {
		const options = this.props.assets.map(({ id, precision, symbol }) => {
			const fee = this.props.getFee(id);

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

		if (fee.value) {
			return formatAmount(fee.value, fee.asset.precision, fee.asset.symbol);
		}

		return options[0] ? options[0].text : '';
	}

	render() {
		const options = this.getOptions();
		const text = this.getText(options);

		return (
			<Form.Field>
				<label htmlFor="fee"> Fee </label>
				<Dropdown selection options={options} text={text} />
			</Form.Field>
		);
	}

}

FeeComponent.propTypes = {
	assets: PropTypes.any.isRequired,
	fee: PropTypes.any.isRequired,
	setValue: PropTypes.func.isRequired,
	getFee: PropTypes.func.isRequired,
	loadGlobalObject: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		assets: state.balance.get('assets').toArray(),
		fee: state.form.getIn([FORM_TRANSFER, 'fee']),
	}),
	(dispatch) => ({
		setValue: (field, value) => dispatch(setValue(FORM_TRANSFER, field, value)),
		loadGlobalObject: () => dispatch(EchoJSActions.fetch('2.0.0')),
		getFee: (value) => dispatch(getFee('transfer', value)),
	}),
)(FeeComponent);
