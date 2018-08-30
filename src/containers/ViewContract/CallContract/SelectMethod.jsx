import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { FORM_CALL_CONTRACT } from '../../../constants/FormConstants';
import { setFunction } from '../../../actions/ContractActions';
import { formatCallContractField } from '../../../helpers/FormatHelper';

class SelectMethod extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchText: '',
		};
	}

	componentWillMount() {

		if (!this.props.functions.size) return;
		if (!this.props.functionName) this.setFunction(this.props.functions.get(0).name);

		const options = this.renderList();
		this.setState({
			options,
		});
	}

	onSearch(e) {
		this.setState({ searchText: e.target.value });
	}

	onCloseDropdown() {
		this.setState({ searchText: '' });
	}

	onDropdownChange(e, value) {
		if (typeof e.target.value === 'undefined') { // if click
			this.setFunction(value);
		} else if (e.keyCode === 13) { // if enter
			this.setFunction(value);
			setTimeout(() => { e.target.blur(); }, 0);
		}
	}

	setFunction(functionName) {
		this.props.setFunction(functionName);
	}


	renderList() {
		const { searchText } = this.state;

		const search = searchText ? new RegExp(searchText.toLowerCase(), 'gi') : null;
		const list = [];
		return this.props.functions.reduce((arr, a, i) => {
			if (!search || a.symbol.toLowerCase().match(search)) {
				arr.push({
					key: a ? a.name + i : '',
					text: a ? formatCallContractField(a.name) : '',
					value: a ? a.name : i,
				});
			}
			return arr;
		}, list);
	}

	render() {
		const functionName = formatCallContractField(this.props.functionName);
		const { searchText } = this.state;
		return (
			<Form.Field>
				<label htmlFor="Method">Select method</label>
				<Dropdown
					search
					onChange={(e, { value }) => this.onDropdownChange(e, value)}
					searchQuery={searchText}
					onSearchChange={(e) => this.onSearch(e)}
					text={functionName}
					selection
					options={this.state.options}
					noResultsMessage="No results are found"
					onClose={(e) => this.onCloseDropdown(e)}
				/>
			</Form.Field>

		);
	}

}

SelectMethod.propTypes = {
	functions: PropTypes.object,
	setFunction: PropTypes.func.isRequired,
	functionName: PropTypes.string.isRequired,
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
