import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Form } from 'semantic-ui-react';
import classnames from 'classnames';
import _ from 'lodash';

import { formatAmount } from '../../helpers/FormatHelper';
import { FORM_CALL_CONTRACT, FORM_CALL_CONTRACT_VIA_ID } from '../../constants/FormConstants';

class FeeComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			options: [],
		};
	}

	componentDidMount() {
		this.getTransferFee();
	}

	componentWillReceiveProps(nextProps) {
		if (_.isEqual(this.props, nextProps)) { return; }

		const { assets, selectedSymbol } = this.props;
		this.setOptions();
		if (!(assets.length)) return;
		const targetAsset = assets.find((asset) => asset.symbol === selectedSymbol);
		if (!targetAsset) return;
		this.getTransferFee();
	}

	onFee(fee) {
		if (!fee) {
			this.props.setFormValue('fee', fee);
		} else {
			if (typeof fee === 'string') {
				this.props.setFormValue('fee', fee);
				return;
			}
			this.props.setValue('fee', fee);
		}
	}

	getTransferFee() {
		if (this.props.type !== 'transfer') return;
		this.props.getTransferFee()
			.then((fee) => this.onFee(fee));
	}

	async getOptionsTransfer() {
		const { assets = [] } = this.props;

		if (!assets.length) return [];

		const feePromises = assets.map((asset) => this.props.getTransferFee(asset.id));
		const fees = await Promise.all(feePromises);

		const options = fees.filter((fee) => fee).map((fee, index) => ({
			key: assets[index].symbol,
			value: JSON.stringify(fee.value),
			text: formatAmount(fee.value, assets[index].precision, assets[index].symbol),
		}));

		return options;
	}

	async getOptionsCallContract() {
		const { fees } = this.props;

		const options = fees.reduce((arr, fee) => {
			arr.push({
				key: fee.asset.symbol,
				value: JSON.stringify(fee),
				text: formatAmount(fee.value, fee.asset.precision, fee.asset.symbol),
			});


			return arr;
		}, []);

		return Promise.resolve(options);
	}

	setOptions() {
		this.getOptions()
			.then((options) => {
				this.setState({
					options,
				});
			});
	}

	async getOptions() {
		const { form, currency } = this.props;

		return await [FORM_CALL_CONTRACT, FORM_CALL_CONTRACT_VIA_ID].includes(form) || (currency && currency.type === 'tokens')
			? this.getOptionsCallContract() : this.getOptionsTransfer();
	}


	getText(options) {
		const { fee } = this.props;
		if (fee && fee.value && fee.asset) {
			return formatAmount(fee.value, fee.asset.precision, fee.asset.symbol);
		}

		return options[0] ? options[0].text : '';
	}


	render() {
		const { options } = this.state;
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
					text={text}
					selectOnBlur={false}
					onChange={(e, { value }) => this.onFee(JSON.parse(value))}
				/>
				<span className="error-message">{this.props.feeError}</span>
			</Form.Field>
		);
	}

}

FeeComponent.propTypes = {
	form: PropTypes.string.isRequired,
	currency: PropTypes.object,
	fees: PropTypes.array.isRequired,
	fee: PropTypes.object,
	isSingle: PropTypes.bool,
	assets: PropTypes.array.isRequired,
	selectedSymbol: PropTypes.string,
	type: PropTypes.string.isRequired,
	feeError: PropTypes.string,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
};

FeeComponent.defaultProps = {
	isSingle: false,
	feeError: null,
	fee: {},
	currency: {},
	selectedSymbol: '',
};


export default FeeComponent;
