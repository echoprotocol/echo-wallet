import React from 'react';
import { Modal, Form, Button, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import _ from 'lodash';
import { injectIntl } from 'react-intl';

import { closeModal } from '../../actions/ModalActions';
import { lookupAccountsList } from '../../actions/AccountActions';
import { changeDelegate } from '../../actions/TransactionActions';
import { setFormValue, clearForm } from '../../actions/FormActions';

import { MODAL_CHANGE_PARENT_ACCOUNT } from '../../constants/ModalConstants';
import { FORM_CHANGE_DELEGATE } from '../../constants/FormConstants';
import Avatar from '../Avatar';
import ErrorMessage from '../../components/ErrorMessage';

import TransactionScenario from '../../containers/TransactionScenario';


class ModalChangeDelegate extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			searchText: '',
			loading: false,
			options: [],
			timeout: null,
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	componentDidMount() {
		this.clear();
	}

	componentWillUnmount() {
		this.clear();
	}

	onClose() {
		this.props.closeModal(MODAL_CHANGE_PARENT_ACCOUNT);
		this.clear();
	}

	onChangeAccount(accountId) {
		const accountName = this.state.options.find(({ value }) => value === accountId) || {};
		this.setState({ searchText: accountName.text });
		this.props.setFormValue('delegate', accountName.text);
	}

	clear() {
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
		this.props.clearForm();
	}

	async accountSearchHandler(e, data) {

		const searchText = data.searchQuery;
		this.setState({
			searchText,
			loading: true,
		});
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}
		this.setState({
			timeout: setTimeout(async () => {
				const options = searchText ? (await lookupAccountsList(searchText))
					.map(([name, id]) => ({
						key: id,
						text: name,
						value: id,
					})) : [];
				this.setState({
					options,
					loading: false,
				});
			}, 300),
		});
	}

	renderList(options) {
		return options.map(({ key, text, value }) => {
			const content = (
				<button
					key={key}
					className="user-item"
					onClick={() => this.onChangeAccount(value)}
				>
					<div className="avatar-wrap">
						<Avatar accountName={text} />
					</div>
					<div className="name">{text}</div>
				</button>
			);
			return ({
				value, key, text, content,
			});
		});
	}

	renderUserAccounts() {
		const {
			preview, currentAccountName,
		} = this.props;
		const formattedPreview = preview.filter((el) => el.name !== currentAccountName).toJS();
		if (!formattedPreview.length) {
			return [];
		}
		const options = formattedPreview.map(({ accountId, name }) => ({
			key: accountId,
			text: name,
			value: accountId,
		}));
		return this.renderList(options);
	}

	render() {
		const {
			show, currentAccountName, delegateObject, intl, keyWeightWarn,
		} = this.props;
		const { searchText, loading, options } = this.state;

		const delegate = options.find(({ text }) => text === searchText);
		const delegateTitle = intl.formatMessage({ id: 'modals.modal_change_parent_account.delegated_to_dropdown.title' });
		const delegatePlaceholder = intl.formatMessage({ id: 'modals.modal_change_parent_account.delegated_to_dropdown.placeholder' });

		return (
			<TransactionScenario
				handleTransaction={() => this.props.changeDelegate(delegate && delegate.value)}
			>
				{
					(submit) => (
						<Modal
							className="change-parent-account-modal"
							open={show}
						>
							<button
								className="icon-close"
								onClick={(e) => this.onClose(e)}
							/>
							<div className="modal-header">
								<h2 className="modal-header-title">
									{intl.formatMessage({ id: 'modals.modal_change_parent_account.title' })}
								</h2>
							</div>
							<Form className="modal-body">
								<div className="field-wrap">
									<div className="field">
										<label htmlFor="current-account">
											{intl.formatMessage({ id: 'modals.modal_change_parent_account.current_acc' })}
										</label>
										<div className="image-input">
											<Avatar accountName={currentAccountName} />
											<input
												type="text"
												name="current-account"
												disabled
												className="ui input"
												value={currentAccountName}
											/>
										</div>
									</div>
									<div className={classnames('field', { error: delegateObject.error })}>
										<label htmlFor="parentAccount" className="field-label">{delegateTitle}</label>
										<div className="account-dropdown-wrap">
											{
												delegate ? <Avatar accountName={searchText} /> : <Avatar />
											}
											<Dropdown
												className={classnames({ empty: loading })}
												options={(searchText && !loading) ?
													this.renderList(options) :
													this.renderUserAccounts()
												}
												searchQuery={searchText}
												search
												selection
												fluid
												name="parentAccount"
												text={searchText || 'Delegated to'}
												onSearchChange={(e, data) => this.accountSearchHandler(e, data)}
												placeholder={delegatePlaceholder}
												selectOnNavigation={false}
												minCharacters={0}
												noResultsMessage={searchText ? 'No results are found' : null}
												onChange={(e, { value }) => this.onChangeAccount(value)}
											/>
										</div>
										<ErrorMessage
											value={delegateObject.error}
											intl={intl}
										/>
									</div>
								</div>
								<div className="form-panel">

									{
										<Button
											type="submit"
											className="main-btn"
											content={intl.formatMessage({ id: 'modals.modal_change_parent_account.confirm_button_text' })}
											onClick={submit}
											disabled={loading || !delegate || keyWeightWarn}
										/>
									}

								</div>
							</Form>
						</Modal>)
				}
			</TransactionScenario>
		);
	}

}

ModalChangeDelegate.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
	changeDelegate: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	currentAccountName: PropTypes.string.isRequired,
	delegateObject: PropTypes.object.isRequired,
	intl: PropTypes.any.isRequired,
	keyWeightWarn: PropTypes.bool.isRequired,
	preview: PropTypes.array.isRequired,
};

ModalChangeDelegate.defaultProps = {
	show: false,
};

export default injectIntl(connect(
	(state) => ({
		show: state.modal.getIn([MODAL_CHANGE_PARENT_ACCOUNT, 'show']),
		currentAccountName: state.global.getIn(['activeUser', 'name']),
		delegateObject: state.form.getIn([FORM_CHANGE_DELEGATE, 'delegate']),
		keyWeightWarn: state.global.get('keyWeightWarn'),
		preview: state.balance.get('preview'),
	}),
	(dispatch) => ({
		closeModal: (modal) => dispatch(closeModal(modal)),
		changeDelegate: (delegateId) => dispatch(changeDelegate(delegateId)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_CHANGE_DELEGATE, field, value)),
		clearForm: () => dispatch(clearForm(FORM_CHANGE_DELEGATE)),
	}),
)(ModalChangeDelegate));
