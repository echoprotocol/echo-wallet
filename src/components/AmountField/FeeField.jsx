import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Form } from 'semantic-ui-react';
import classnames from 'classnames';
import _ from 'lodash';

import { formatAmount } from '../../helpers/FormatHelper';

import { setValue } from '../../actions/FormActions';
import { getFee, fetchFee } from '../../actions/TransactionActions';
import { setContractFees } from '../../actions/ContractActions';

import { FORM_CALL_CONTRACT } from '../../constants/FormConstants';

class FeeComponent extends React.Component {

	constructor(props) {
		super(props);

		props.fetchFee().then((fee) => {
			props.setValue('fee', fee);
		});
	}

	componentDidMount() {
		this.props.setContractFees();
	}

	shouldComponentUpdate(nextProps) {
		if (_.isEqual(this.props, nextProps)) { return false; }

		const { fee, note } = this.props;

		if (note.value !== nextProps.note.value) {
			const value = this.props.getFee(fee.asset.id, nextProps.note.value);
			this.props.setValue('fee', value);
		}

		return true;
	}

	onFee(fee) {
		this.props.setValue('fee', fee);
	}

	getOptions() {
		const { assets, note } = this.props;

		const options = assets.reduce((arr, asset) => {
			const fee = this.props.getFee(asset.id, note.value);

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
		const { form } = this.props;

		const options = form === FORM_CALL_CONTRACT ? this.getOptionsCallContract() : this.getOptions();
		const text = this.getText(options);
		return (
			<Form.Field className={classnames({ 'fee-dropdown-wrap': !this.props.isSingle })}>
				{this.props.isSingle ? <label htmlFor="Method">fee</label> : null}
				<Dropdown
					className={classnames({
						'fee-dropdown': !this.props.isSingle,
						'no-choice': options.length < 2,
					})}
					selection
					fluid
					tabIndex={(options.length < 2) ? '-1' : '0'}
					options={options}
					text={text}
					onChange={(e, { value }) => this.onFee(JSON.parse(value))}
				/>
			</Form.Field>
		);
	}

}

FeeComponent.propTypes = {
	isSingle: PropTypes.bool,
	fee: PropTypes.object,
	assets: PropTypes.array,
	form: PropTypes.string.isRequired,
	note: PropTypes.any.isRequired,
	fees: PropTypes.array.isRequired,
	setValue: PropTypes.func.isRequired,
	getFee: PropTypes.func.isRequired,
	fetchFee: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
};

FeeComponent.defaultProps = {
	isSingle: false,
	fee: {},
	assets: [],
};

export default connect(
	(state, { form, isSingle }) => ({
		isSingle,
		assets: state.balance.get('assets').toArray(),
		fee: state.form.getIn([form, 'fee']),
		note: state.form.getIn([form, 'note']) || {},
		fees: state.fee.toArray() || [],
		form,
	}),
	(dispatch, { form, type }) => ({
		setValue: (field, value) => dispatch(setValue(form, field, value)),
		getFee: (asset, note) => dispatch(getFee(type, asset, note)),
		fetchFee: () => dispatch(fetchFee(type)),
		setContractFees: () => dispatch(setContractFees()),
	}),
)(FeeComponent);
