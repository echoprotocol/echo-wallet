import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import Avatar from '../../components/Avatar';

class PartnerAccountPanel extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchText: '',
		};
	}

	onChangeAccount() {
		// const accountName = this.state.options.find(({ value }) => value === accountId) || {};
		// this.props.setFormValue('registrarAccount', accountName);
		// this.setState({ searchText: accountName.text });
	}

	accountSearchHandler(data) {
		this.setState({
			searchText: data.searchQuery,
		});
	}

	renderList() {
		const { accounts } = this.props;
		return accounts.map(({ name }) => {
			const content = (
				<button
					key={name}
					className="user-item"
					// onClick={() => this.onChangeAccount(name)}
				>
					<div className="avatar-wrap">
						<Avatar accountName={name} />
					</div>

					<div className="name">{name}</div>

				</button>

			);

			return ({
				value: name,
				key: name,
				content,
			});
		});
	}


	render() {
		const { searchText } = this.state;
		const { loading } = this.props;

		return (
			<React.Fragment>
				<p className="register-info">
					Registrate a new account on your own. Choose account below
				</p>
				<div className="field-wrap">
					<div className="field">
						<label htmlFor="parentAccount" className="field-label">Parent account name</label>
						<Dropdown
							options={this.renderList()}
							searchQuery={searchText}
							search
							selection
							fluid
							disabled={loading}
							name="parentAccount"
							text={searchText || 'Parent account name'}
							onSearchChange={(data) => this.accountSearchHandler(data)}
							placeholder="Parent account"
							minCharacters={0}
							noResultsMessage="No results are found"
							onChange={(e, { value }) => this.onChangeAccount(value)}
						/>
					</div>
				</div>
			</React.Fragment>
		);
	}

}

PartnerAccountPanel.propTypes = {
	loading: PropTypes.bool.isRequired,
	accounts: PropTypes.array,
};

PartnerAccountPanel.defaultProps = {
	accounts: [{ name: 'ac1' }, { name: 'ac2' }, { name: 'ac3' }],
};

export default PartnerAccountPanel;
