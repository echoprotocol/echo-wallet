import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import classnames from 'classnames';

import { FORM_TRANSFER } from '../../constants/FormConstants';
import { setValue } from '../../actions/FormActions';

class CurrencyField extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchText: '',
			isOpenDropdown: false,
		};
	}

	componentDidUpdate() {
		const { assets, currency } = this.props;

		if (assets.length && !currency) {
			this.props.setValue('currency', assets[0]);
		}
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

	setCurrency(currency, type) {
		this.props.setValue('currency', { ...currency, type });
		this.setState({ isOpenDropdown: false });
	}

	renderList(type) {
		const { searchText } = this.state;

		const search = searchText ? new RegExp(searchText.toLowerCase(), 'gi') : null;

		let list = [
			<Dropdown.Header key={`${type}_header`} content={type.toUpperCase()} />,
		];

		list = this.props[type].reduce((arr, a) => {
			if (search && !a.symbol.toLowerCase().match(search)) {
				return arr;
			}

			arr.push((
				<Dropdown.Item key={a.id} onClick={(e) => this.setCurrency(a, type, e)}>
					{a.symbol}
				</Dropdown.Item>
			));

			return arr;
		}, list);

		return list.length !== 1 ? list : [];
	}

	render() {
		const { assets, tokens } = this.props;
		const { searchText } = this.state;

		const currency = this.props.currency || assets[0];

		const list = this.renderList('assets').concat(this.renderList('tokens'));

		return (
			<Dropdown
				search
				text={currency ? currency.symbol : ''}
				searchQuery={searchText}
				className={classnames('assets-tokens-dropdown', { 'no-choice': assets.concat(tokens).length <= 1 })}
				closeOnBlur
				open={this.state.isOpenDropdown}
				onClick={(e) => this.onToggleDropdown(e)}
				onSearchChange={(e) => this.onSearch(e)}
				onClose={(e) => this.onCloseDropdown(e)}
			>
				<Dropdown.Menu>
					{
						!list.length ?
							<Dropdown.Item onClick={(e) => this.onCloseDropdown(e)}>
								No results found.
							</Dropdown.Item> : list
					}
				</Dropdown.Menu>
			</Dropdown>
		);
	}

}

CurrencyField.propTypes = {
	currency: PropTypes.object,
	assets: PropTypes.any.isRequired,
	tokens: PropTypes.any.isRequired,
	setValue: PropTypes.func.isRequired,
};

CurrencyField.defaultProps = {
	currency: null,
};

export default connect(
	(state) => ({
		tokens: state.balance.get('tokens').toArray(),
		assets: state.balance.get('assets').toArray(),
		currency: state.form.getIn([FORM_TRANSFER, 'currency']),
	}),
	(dispatch) => ({
		setValue: (field, value) => dispatch(setValue(FORM_TRANSFER, field, value)),
	}),
)(CurrencyField);
