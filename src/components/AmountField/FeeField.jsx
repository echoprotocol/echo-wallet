import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import classnames from 'classnames';
import _ from 'lodash';

import { formatAmount } from '../../helpers/FormatHelper';
import { setValue } from '../../actions/FormActions';
import { getFee, fetchFee, estimateFormFee } from '../../actions/TransactionActions';

class FeeComponent extends React.Component {

	constructor(props) {
		super(props);

		props.fetchFee().then((fee) => {
			props.setValue('fee', fee);
		});
	}

	shouldComponentUpdate(nextProps) {
		if (_.isEqual(this.props, nextProps)) { return false; }

		const { fee, comment } = this.props;

		if (comment.value !== nextProps.comment.value) {
			const value = this.props.getFee(fee.asset.id, nextProps.comment.value);
			this.props.setValue('fee', value);
		}

		return true;
	}

	onFee(fee) {
		this.props.setValue('fee', fee);
	}

	getOptions() {
		const { assets, comment } = this.props;

		const options = assets.reduce((arr, asset) => {
			const fee = this.props.getFee(asset.id, comment.value);

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
			<Dropdown
				className={classnames('fee-dropdown', {
					'no-choice': options.length < 2,
				})}
				selection
				options={options}
				text={text}
				onChange={(e, { value }) => this.onFee(JSON.parse(value))}
			/>
		);
	}

}

FeeComponent.propTypes = {
	fee: PropTypes.object,
	assets: PropTypes.array,
	comment: PropTypes.any.isRequired,
	setValue: PropTypes.func.isRequired,
	getFee: PropTypes.func.isRequired,
	fetchFee: PropTypes.func.isRequired,
};

FeeComponent.defaultProps = {
	fee: {},
	assets: [],
};

export default connect(
	(state, { form }) => ({
		assets: state.balance.get('assets').toArray(),
		fee: state.form.getIn([form, 'fee']),
		comment: state.form.getIn([form, 'comment']) || {},
	}),
	(dispatch, { form, type }) => ({
		setValue: (field, value) => dispatch(setValue(form, field, value)),
		getFee: (asset, comment) => dispatch(getFee(type, asset, comment)),
		fetchFee: () => dispatch(fetchFee(type)),
	}),
)(FeeComponent);
