import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { FORM_CALL_CONTRACT } from '../../../constants/FormConstants';
import { setFunction } from '../../../actions/CallContractActions';

class SelectMethod extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchText: '',
			isOpenDropdown: false,
		};
	}

	onSearch(e) {
		this.setState({ searchText: e.target.value });
	}

	onToggleDropdown() {
		this.setState({ searchText: '', isOpenDropdown: !this.state.isOpenDropdown });
	}

	onCloseDropdown() {
		this.setState({ searchText: '', isOpenDropdown: false });
	}

	setFunction(functionName) {
		this.props.setFunction(functionName);
		this.setState({ isOpenDropdown: false });
	}


	renderList() {
		const { searchText } = this.state;

		const search = searchText ? new RegExp(searchText.toLowerCase(), 'gi') : null;

		const list = this.props.functions.reduce((arr, f) => {
			if (search && !f.name.toLowerCase().match(search)) {
				return arr;
			}

			arr.push((
				<Dropdown.Item key={f.name} onClick={(e) => this.setFunction(f.name, e)}>
					{f.name}
				</Dropdown.Item>
			));

			return arr;
		}, []);

		return list.length !== 1 ? list : [];
	}

	render() {
		const { functionName } = this.props;
		const { searchText } = this.state;

		return (
			<Form.Field>
				<label htmlFor="Method">Select method</label>
				<Dropdown
					placeholder="Enter method or choose it from dropdown list"
					search
					searchQuery={searchText}
					fluid
					closeOnBlur
					text={functionName.value}
					open={this.state.isOpenDropdown}
					onClick={(e) => this.onToggleDropdown(e)}
					onSearchChange={(e) => this.onSearch(e)}
					onClose={(e) => this.onCloseDropdown(e)}
					className="selection"
				>
					<Dropdown.Menu>
						{this.renderList()}
					</Dropdown.Menu>
				</Dropdown>
			</Form.Field>

		);
	}

}

SelectMethod.propTypes = {
	functions: PropTypes.object,
	setFunction: PropTypes.func.isRequired,
	functionName: PropTypes.object.isRequired,
};

SelectMethod.defaultProps = {
	functions: [],
};

export default connect(
	(state) => ({
		functions: state.contract.get('functions'),
		functionName: state.form.getIn([FORM_CALL_CONTRACT, 'functionName']),
	}),
	(dispatch) => ({
		setFunction: (value) => dispatch(setFunction(value)),
	}),
)(SelectMethod);
