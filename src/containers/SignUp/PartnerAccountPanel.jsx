import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import classnames from 'classnames';

import Avatar from '../../components/Avatar';

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
		const { loading, signupOptionsForm, accounts } = this.props;

		const registrarAccount = signupOptionsForm.get('registrarAccount');

		return accounts.length ? (
			<React.Fragment>
				<div className="register-info">
					<p>
						Registrate a new account on your own. Choose account below
					</p>
				</div>
				<div className={classnames('field-wrap error-wrap', { error: registrarAccount.error })}>
					<div className="field ">
						<label htmlFor="parentAccount" className="field-label">Parent account name</label>
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
								placeholder="Parent account"
								minCharacters={0}
								noResultsMessage="No results are found"
								onChange={(e, { value }) => this.onChangeAccount(value)}
							/>
						</div>
						{registrarAccount.error && <span className="error-message">{registrarAccount.error}</span>}
					</div>
				</div>
			</React.Fragment>
		) : (
			<div className="register-info">
				<p>You don&apos;t have an account.</p>
				<p>
				You can generate a new account on your own.
				Log in your another wallet account beforehand to do so
				</p>
			</div>
		);
	}

}

PartnerAccountPanel.propTypes = {
	loading: PropTypes.bool.isRequired,
	setFormValue: PropTypes.func.isRequired,
	signupOptionsForm: PropTypes.object.isRequired,
	accounts: PropTypes.array,
};

PartnerAccountPanel.defaultProps = {
	accounts: [],
};

export default PartnerAccountPanel;
