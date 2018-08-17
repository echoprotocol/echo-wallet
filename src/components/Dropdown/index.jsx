import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

class DropdownComponent extends React.Component {

	// onChange() {
	//
	// }

	render() {
		const { options, data } = this.props;
		if (data) {
			console.log(data);
		}
		return (
			<Dropdown
				placeholder="def"
				compact
				selection
				className="item contract-type-dropdown air"
				options={options}
				// onChange={(e, data) => this.onChange(e, data)}
			/>
		);
	}

}

DropdownComponent.propTypes = {
	options: PropTypes.array.isRequired,
	data: PropTypes.any,
};

DropdownComponent.defaultProps = {
	data: null,
};

export default DropdownComponent;
