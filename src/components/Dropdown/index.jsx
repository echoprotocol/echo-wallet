import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import { List } from 'immutable';

import { set } from '../../actions/ConverterActions';

import { converter } from '../../helpers/FormatHelper';

class DropdownComponent extends React.Component {

	onChange(e, type) {
		const { data, component } = this.props;

		let { convertedConstants, topics } = this.props;

		const result = converter(type, data);

		if (result) {
			if (component.name) {
				let isChanged = false;

				convertedConstants = convertedConstants.map((val) => {
					if (val.name === component.name) {
						val.value = result;
						isChanged = true;
					}
					return val;
				});

				if (!isChanged) {
					convertedConstants.push({
						name: component.name,
						value: result,
					});
				}

				this.props.set('convertedConstants', new List(convertedConstants));
			} else if (component === 'dataLog') {
				this.props.set('data', result);
			} else {
				let isChanged = false;

				topics = topics.map((val) => {
					if (val.id === component) {
						val.value = result;
						isChanged = true;
					}
					return val;
				});

				if (!isChanged) {
					topics.push({
						id: component,
						value: result,
					});
				}

				this.props.set('topics', new List(topics));
			}
		} else if (component.name) {
			convertedConstants = convertedConstants.filter((val) => val.name !== component.name);

			this.props.set('convertedConstants', new List(convertedConstants));
		} else if (component === 'dataLog') {
			this.props.set('data', '');
		} else {
			topics = topics.filter((val) => val.id !== component);

			this.props.set('topics', new List(topics));
		}
	}

	render() {
		const { variativeOptions } = this.props;
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
				placeholder="hex"
				compact
				selection
				className="item contract-type-dropdown air"
				options={variativeOptions || options}
				onChange={(e, data) => this.onChange(e, data.value)}
			/>
		);
	}

}

DropdownComponent.propTypes = {
	variativeOptions: PropTypes.any,
	component: PropTypes.any.isRequired,
	convertedConstants: PropTypes.array.isRequired,
	topics: PropTypes.array.isRequired,
	data: PropTypes.any,
	set: PropTypes.func.isRequired,
};

DropdownComponent.defaultProps = {
	data: null,
	variativeOptions: null,
};

export default connect(
	(state) => ({
		convertedConstants: state.converter.get('convertedConstants').toJS(),
		topics: state.converter.get('topics').toJS(),
	}),
	(dispatch) => ({
		set: (field, value) => dispatch(set(field, value)),
	}),
)(DropdownComponent);
