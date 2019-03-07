import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Form } from 'semantic-ui-react';
import classnames from 'classnames';
import _ from 'lodash';

import { formatAmount } from '../../helpers/FormatHelper';

import { setValue } from '../../actions/FormActions';
import { getFeeSync, getFee, fetchFee } from '../../actions/TransactionActions';
import { setContractFees } from '../../actions/ContractActions';

import { FORM_CALL_CONTRACT, FORM_CALL_CONTRACT_VIA_ID } from '../../constants/FormConstants';

class FeeComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isChanged: false,
		};
	}
	componentDidMount() {
		this.props.fetchFee().then((fee) => {
			this.props.setValue('fee', fee);
		});
		this.props.setContractFees();
	}

	componentWillReceiveProps(nextProps) {
		if (_.isEqual(this.props, nextProps)) { return; }

		const {
			note, assets, selectedSymbol,
		} = this.props;

		if (assets.length && !this.state.isChanged) {

			assets.forEach((asset) => {
				if (asset.symbol === selectedSymbol) {
					this.props.getFee(note.value).then((resultFee) => {
						if (resultFee) {
							this.props.setValue('fee', resultFee);
							this.setState({ isChanged: true });
						}
					});
				}
			});
		}
	}

	shouldComponentUpdate(nextProps) {
		if (_.isEqual(this.props, nextProps)) { return false; }

		const {
			note, type,
		} = this.props;

		if (note.value !== nextProps.note.value || type !== nextProps.type) {
			this.props.getFee((nextProps.type !== 'call_contract' || nextProps.type !== 'create_contract') && nextProps.note.value).then((value) => {
				if (value) {
					this.props.setValue('fee', value);
				}
			});
		}

		return true;
	}

	onFee(fee) {
		this.props.setValue('fee', fee);
	}

	getOptionsTransfer() {
		const { assets, note } = this.props;

		const options = assets.reduce((arr, asset) => {
			const fee = this.props.getFeeSync(asset.id, note.value);

			if (fee) {
				arr.push({
					key: asset.symbol,
					value: JSON.stringify(fee),
					text: formatAmount(fee.value, asset.precision, asset.symbol),
				});
			}

			return arr;
		}, []);

		return options;
	}

	getOptionsCallContract() {
		const { fees } = this.props;

		const options = fees.reduce((arr, fee) => {
			arr.push({
				key: fee.asset.symbol,
				value: JSON.stringify(fee),
				text: formatAmount(fee.value, fee.asset.precision, fee.asset.symbol),
			});


			return arr;
		}, []);

		if (this.props.fee && this.props.fee.asset && this.props.fee.asset.symbol) {
			const feeAsset = this.props.fee.asset.symbol;

			const newFee = options.find((fee) => (fee.key === feeAsset));
			if (newFee) this.onFee(JSON.parse(newFee.value));
		}

		return options;
	}

	getOptions() {
		const { form, currency } = this.props;

		return [FORM_CALL_CONTRACT, FORM_CALL_CONTRACT_VIA_ID].includes(form) || currency.type === 'tokens'
			? this.getOptionsCallContract() : this.getOptionsTransfer();
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

		return (
			<Form.Field className={classnames({
				'fee-dropdown-wrap': !this.props.isSingle,
				error: this.props.feeError,
			})}
			>
				{this.props.isSingle && <label htmlFor="Method">fee</label> }
				<Dropdown
					className={classnames({
						'fee-default-dropdown': this.props.isSingle,
						'fee-dropdown': !this.props.isSingle,
						'no-choice': options.length < 2,
					})}
					selection
					fluid
					tabIndex={(options.length < 2) ? '-1' : '0'}
					options={options}
					text={options.length ? text : '0 ECHO'}
					selectOnBlur={false}
					onChange={(e, { value }) => this.onFee(JSON.parse(value))}
				/>
				<span className="error-message">{this.props.feeError}</span>
			</Form.Field>
		);
	}

}

FeeComponent.propTypes = {
	isSingle: PropTypes.bool,
	fee: PropTypes.object,
	assets: PropTypes.array,
	selectedSymbol: PropTypes.string,
	form: PropTypes.string.isRequired,
	note: PropTypes.any.isRequired,
	fees: PropTypes.array.isRequired,
	setValue: PropTypes.func.isRequired,
	getFeeSync: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	getFee: PropTypes.func.isRequired,
	fetchFee: PropTypes.func.isRequired,
	type: PropTypes.string.isRequired,
	feeError: PropTypes.string,
	currency: PropTypes.any,
};

FeeComponent.defaultProps = {
	isSingle: false,
	fee: {},
	assets: [],
	selectedSymbol: '',
	currency: {},
	feeError: '',
};

export default connect(
	(state, { form, isSingle }) => ({
		isSingle,
		assets: state.balance.get('assets').toArray(),
		fee: state.form.getIn([form, 'fee']),
		note: state.form.getIn([form, 'note']) || {},
		currency: state.form.getIn([form, 'currency']) || {},
		selectedSymbol: state.form.getIn([form, 'selectedSymbol']),
		feeError: state.form.getIn([form, 'feeError']),
		fees: state.fee.toArray() || [],
		form,
	}),
	(dispatch, { form, type }) => ({
		setValue: (field, value) => dispatch(setValue(form, field, value)),
		getFeeSync: (asset, note) => dispatch(getFeeSync(type, asset, note)),
		setContractFees: () => dispatch(setContractFees(form)),
		getFee: (note) => dispatch(getFee(type, note)),
		fetchFee: () => dispatch(fetchFee(type)),
	}),
)(FeeComponent);
