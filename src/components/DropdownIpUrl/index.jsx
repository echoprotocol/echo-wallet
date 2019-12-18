import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import classnames from 'classnames';

class DropdownIpUrl extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isDropdownEmpty: true,
			timeout: null,
		};
	}

	onSearch(e) {
		const { value } = e.target;
		this.setIsOptionsEmpty(value);
		this.validateAndSetIpOrUrl(value);
		this.openDropdown();
	}

	onDropdownChange(e, value) {
		this.setIsOptionsEmpty(value);
		this.validateAndSetIpOrUrl(value);
		this.closeDropdown();
	}

	onFocus(value) {
		this.setIsOptionsEmpty(value);
		this.openDropdown();
	}

	setIsOptionsEmpty(value) {
		const options = this.props.remoteRegistrationAddresses;
		const res = options.filter(({ address }) => address.match(value) && address !== value);
		this.setState({ isDropdownEmpty: res.size === 0 });
	}

	openDropdown() {
		this.props.setValue('showSavedAddressesDropdown', true);
	}

	closeDropdown() {
		this.props.setValue('showSavedAddressesDropdown', false);
	}

	validateAndSetIpOrUrl(value) {
		this.props.setFormValue('ipOrUrl', value);

		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}

		this.setState({
			timeout: setTimeout(async () => {
				this.props.validateAndSetIpOrUrl(value);
			}, 600),
		});
	}

	renderList() {
		const { signupOptionsForm, remoteRegistrationAddresses } = this.props;
		const ipOrUrl = signupOptionsForm.get('ipOrUrl');

		return remoteRegistrationAddresses
			.filter(({ address }) => address.match(ipOrUrl.value) && address !== ipOrUrl.value)
			.map((i) => {
				const content = (
					<div className="dropdown-item">
						<div className={classnames(i.type)} >
							{i.address}
						</div>
					</div>
				);
				return {
					value: i.address,
					key: i.address,
					content,
				};
			}).toArray();
	}

	render() {
		const { status, loading, signupOptionsForm } = this.props;
		const { isDropdownEmpty } = this.state;

		const ipOrUrl = signupOptionsForm.get('ipOrUrl');
		const open = signupOptionsForm.get('showSavedAddressesDropdown');

		return (
			<React.Fragment>
				<Dropdown
					open={open}
					floating
					search={() => this.renderList()}
					fluid
					selection
					selectOnBlur={false}
					disabled={loading}
					className={classnames('ip-url-dropdown', { 'empty-search': isDropdownEmpty })}
					searchQuery={ipOrUrl.value}
					icon={false}
					onSearchChange={(e) => this.onSearch(e)}
					onChange={(e, { value }) => this.onDropdownChange(e, value)}
					text={ipOrUrl.value}
					options={this.renderList()}
					onBlur={() => this.closeDropdown()}
					onFocus={() => this.onFocus(ipOrUrl.value)}
					noResultsMessage={null}
				/>
				{
					status &&
						<span className={classnames('value-status', `icon-${status}`)} />
				}
			</React.Fragment>
		);
	}

}

DropdownIpUrl.propTypes = {
	status: PropTypes.string.isRequired,
	loading: PropTypes.bool.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	validateAndSetIpOrUrl: PropTypes.func.isRequired,
	signupOptionsForm: PropTypes.object.isRequired,
	remoteRegistrationAddresses: PropTypes.object.isRequired,
};

export default DropdownIpUrl;
