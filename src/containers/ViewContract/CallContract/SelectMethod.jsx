import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { FORM_CALL_CONTRACT } from '../../../constants/FormConstants';
import { formatCallContractField } from '../../../helpers/FormatHelper';
import { setContractFees, setFunction } from '../../../actions/ContractActions';

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
			this.props.setContractFees();
		} else if (e.keyCode === 13) { // if enter
			this.setFunction(value);
			setTimeout(() => { e.target.blur(); }, 0);
			this.props.setContractFees();
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
		const { intl } = this.props;
		const onResMsg = intl.formatMessage({ id: 'smart_contract_page.contract_info.call_contract_tab.form.no_result_message' });
		return (
			<Form.Field>
				<label htmlFor="Method">
					<FormattedMessage id="smart_contract_page.contract_info.call_contract_tab.form.select_method_field" />
				</label>
				<Dropdown
					search
					onChange={(e, { value }) => this.onDropdownChange(e, value)}
					searchQuery={searchText}
					onSearchChange={(e) => this.onSearch(e)}
					text={functionName}
					selection
					options={this.state.options}
					noResultsMessage={onResMsg}
					onClose={(e) => this.onCloseDropdown(e)}
				/>
			</Form.Field>

		);
	}

}

SelectMethod.propTypes = {
	functions: PropTypes.object,
	functionName: PropTypes.string.isRequired,
	setFunction: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

SelectMethod.defaultProps = {
	functions: [],
};

export default injectIntl(connect(
	(state) => ({
		functions: state.contract.get('functions'),
		functionName: state.form.getIn([FORM_CALL_CONTRACT, 'functionName']),
	}),
	(dispatch) => ({
		setFunction: (value) => dispatch(setFunction(value)),
		setContractFees: () => dispatch(setContractFees(FORM_CALL_CONTRACT)),
	}),
)(SelectMethod));
