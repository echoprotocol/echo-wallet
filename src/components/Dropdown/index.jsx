import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import { convert } from '../../actions/ConverterActions';

class DropdownComponent extends React.Component {

	onChange(e, { value: type }) {
		const { data, component } = this.props;
		this.props.convert(type, data, component);
	}

	render() {
		const { variativeOptions, activeType } = this.props;
		const options = [
			{
				text: 'hex',
				value: 'hex',
			},
			{
				text: 'string',
				value: 'string',
			},
			{
				text: 'number',
				value: 'number',
			},
			{
				text: 'id',
				value: 'id',
			},
		];

		return (
			<Dropdown
				placeholder={activeType || 'hex'}
				compact
				selection
				className="contract-type-dropdown air"
				options={variativeOptions || options}
				onChange={(e, data) => this.onChange(e, data)}
			/>
		);
	}

}

DropdownComponent.propTypes = {
	variativeOptions: PropTypes.any,
	component: PropTypes.any.isRequired,
	data: PropTypes.any,
	activeType: PropTypes.any,
	convert: PropTypes.func.isRequired,
};

DropdownComponent.defaultProps = {
	activeType: null,
	data: null,
	variativeOptions: null,
};

export default connect(
	() => ({}),
	(dispatch) => ({
		convert: (type, data, component) => dispatch(convert(type, data, component)),
	}),
)(DropdownComponent);
