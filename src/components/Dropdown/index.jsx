import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

class DropdownComponent extends React.Component {

	render() {
		const { options } = this.props;
		console.log(options);
		return (
			<React.Fragment>
				<Dropdown
					placeholder="default"
					compact
					selection
					className="item contract-type-dropdown air"
					options={options}
					// onChange={(e, data) => this.onChange(e, data)}
				/>
			</React.Fragment>
		);
	}

}

DropdownComponent.propTypes = {
	options: PropTypes.array.isRequired,
};

export default DropdownComponent;
