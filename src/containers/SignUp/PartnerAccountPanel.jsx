import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import classnames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import Avatar from '../../components/Avatar';
import ErrorMessage from '../../components/ErrorMessage';

class PartnerAccountPanel extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchText: '',
			options: this.renderList(props.accounts),
			timeout: null,
		};
	}

	componentDidUpdate(prevProps) {
		if (this.props.accounts !== prevProps.accounts) {
			this.accountSearchHandler({ searchQuery: this.state.searchText });
		}
	}

	onChangeAccount(accountName) {
		this.props.setFormValue('registrarAccount', accountName);
		this.setState({ searchText: accountName });
	}

	accountSearchHandler(data) {
		const { accounts } = this.props;
		this.setState({
			searchText: data.searchQuery,
		});

		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}

		this.setState({
			timeout: setTimeout(() => {
				const filteredAccounts = accounts.filter(({ name }) => name.match(data.searchQuery));
				this.setState({
					options: this.renderList(filteredAccounts),
				});
			}, 300),
		});
	}

	renderList(accounts) {
		return accounts.map(({ name }) => {
			const content = (
				<button
					key={name}
					className="user-item"
				>
					<div className="avatar-wrap">
						<Avatar accountName={name} />
					</div>
					<div className="name">{name}</div>
				</button>
			);

			return ({
				value: name, key: name, text: name, content,
			});
		});

	}


	render() {
		const { options } = this.state;
		const {
			loading, signupOptionsForm, accounts, intl,
		} = this.props;

		const registrarAccount = signupOptionsForm.get('registrarAccount');

		return accounts.length ? (
			<React.Fragment>
				<div className="register-info">
					<p>
						<FormattedMessage id="sign_page.register_account_page.more_options_section.parent_account_section.text" />
					</p>
				</div>
				<div className="field-wrap">
					<div className={classnames('field', { error: registrarAccount.error })}>
						<label htmlFor="parentAccount" className="field-label">
							<FormattedMessage id="sign_page.register_account_page.more_options_section.parent_account_section.dropdown.title" />
						</label>
						<div className="account-dropdown-wrap">
							<Avatar accountName={registrarAccount.value} />
							<Dropdown
								options={options}
								search
								selection
								fluid
								disabled={loading}
								name="parentAccount"
								text={registrarAccount.value || 'Parent account name'}
								onSearchChange={(e, data) => this.accountSearchHandler(data)}
								placeholder={
									<FormattedMessage id="sign_page.register_account_page.more_options_section.parent_account_section.dropdown.placeholder" />
								}
								minCharacters={0}
								noResultsMessage="No results are found"
								onChange={(e, { value }) => this.onChangeAccount(value)}
							/>
						</div>
						<ErrorMessage
							value={registrarAccount.error}
							intl={intl}
						/>
					</div>
				</div>
			</React.Fragment>
		) : (
			<div className="register-info">
				<p>
					<FormattedMessage id="sign_page.register_account_page.more_options_section.parent_account_section.dont_have_acc_text_pt1" />
				</p>
				<p>
					<FormattedMessage id="sign_page.register_account_page.more_options_section.parent_account_section.dont_have_acc_text_pt2" />
				</p>
			</div>
		);
	}

}

PartnerAccountPanel.propTypes = {
	loading: PropTypes.bool.isRequired,
	setFormValue: PropTypes.func.isRequired,
	signupOptionsForm: PropTypes.object.isRequired,
	intl: PropTypes.any.isRequired,
	accounts: PropTypes.array,
};

PartnerAccountPanel.defaultProps = {
	accounts: [],
};

export default injectIntl(PartnerAccountPanel);
