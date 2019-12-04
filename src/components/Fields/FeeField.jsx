
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
			fee: this.props.fee,
		};
	}

	componentDidMount() {
		this.getTransferFee();
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEqual(this.state.fee, nextProps.fee) ||
		(nextProps.fee && !this.state.options.length)) {
			this.setOptions();
		}
	}

	onFee(fee) {
		const { options } = this.state;
		const { assets = [] } = this.props;

		if (!fee) {
			this.props.setFormValue('fee', fee);
		} else {
			if (typeof fee === 'object') {
				this.props.setValue('fee', fee);
				return;
			}
			const symbol = options.find((opt) => opt.value === fee.toString());
			const asset = assets.find((opt) => opt.symbol === symbol.key);
			this.props.setValue('fee', { value: fee, asset });
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

		return fees.filter((fee) => fee).map((fee, index) => ({
			key: assets[index].symbol,
			value: JSON.stringify(fee),
			text: formatAmount(fee.value, assets[index].precision, assets[index].symbol),
		}));
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
			return formatAmount(fee.value, fee.asset.precision);
		}

		return options[0] ? options[0].text : '';
	}

	render() {
		const { options } = this.state;
		const { fee } = this.props;
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
						empty: options.length < 2,
					})}
					selection
					placeholder="FEE"
					tabIndex={(options.length < 2) ? '-1' : '0'}
					options={(options.length < 2) ? [] : options}
					text={`${text}\u00a0${fee.asset.symbol}`}
					selectOnBlur={false}
					noResultsMessage={options.length < 2 ? 'No results are found' : null}
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
};


export default FeeComponent;
