/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Table } from 'semantic-ui-react';
import classnames from 'classnames';
import _ from 'lodash';

import { isChanged, unlockPrivateKey, validateKey } from '../../actions/TableActions';
import { FORM_PERMISSION_KEY } from '../../constants/FormConstants';
import { setInFormError, setInFormValue, setValue, removeKey } from '../../actions/FormActions';

class PermissionTableRow extends Component {

	constructor(props) {
		super(props);
		this.state = {
			editRows: [],
			removedRows: [],
			editedAddKeys: [],
		};

		this.onEdit = this.onEdit.bind(this);
		this.closeEdit = this.closeEdit.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const {
			keyRole, keys, data, addKeys,
		} = nextProps;

		const keysLength = prevState.editedAddKeys.length;
		const editedAddKeys = [];

		if (!keysLength && !addKeys.length && keys.getIn([keyRole, 'keys']).size - data.length !== keysLength) {
			keys.getIn([keyRole, 'keys']).mapEntries(([key, value]) => {

				if (Number.isNaN(Number(key)) || value || !value.get('key').value || !value.get('weight').value) {
					return;
				}

				nextProps.onAddKey(parseInt(key, 10));
				editedAddKeys.push(parseInt(key, 10));
			});
		}

		if (nextProps.resetAddKeys) {
			return {
				editedAddKeys: [],
				removedRows: [],
			};
		}

		if (editedAddKeys.length) {
			return { editedAddKeys };
		}

		return null;
	}

	componentDidUpdate(prevProps) {
		const {
			keys, firstFetch, data, keyRole,
		} = this.props;
		const { keys: prevKeys, firstFetch: prevFetch } = prevProps;

		if ((firstFetch !== prevFetch && firstFetch) || (data.length !== prevProps.data.length)) {
			data.forEach((k) => {
				this.props.setValue([keyRole, 'keys', k.key, 'key'], k.key);
				this.props.setValue([keyRole, 'keys', k.key, 'weight'], k.weight);
			});
		}

		if (!_.isEqual(keys, prevKeys)) {
			this.props.set('isChanged', this.props.isChanged());
		}
	}


	onClick(k) {
		this.props.unlockPrivateKey(k);
	}

	onEdit(e, k) {
		const { keyRole, keys } = this.props;
		const { editRows } = this.state;
		const editKey = keys.getIn([keyRole, 'keys', k.key, 'key']);
		const editWeight = keys.getIn([keyRole, 'keys', k.key, 'weight']);

		editRows.push({ [k.key]: { key: editKey.value, weight: editWeight.value } });

		this.setState({
			editRows,
		});
	}

	onInput(e, type) {
		e.preventDefault();
		const { keyRole } = this.props;

		const field = e.target.name;
		const value = e.target.value.trim();

		this.props.setValue([keyRole, 'keys', field, type], value);
	}

	async onSaveRow(e, k, key, weight) {
		if (await this.props.validateField(k.role, k.key, key, weight)) {
			return;
		}

		const { editRows } = this.state;

		editRows.splice(editRows.findIndex((value) => Object.keys(value).includes(k.key)), 1);

		this.setState({
			editRows,
		});
	}

	onRemoveRow(e, k) {
		const { keyRole } = this.props;

		this.props.setValue([keyRole, 'keys', k.key, 'remove'], true);

		const { removedRows } = this.state;

		removedRows.push(k.key);

		this.setState({ removedRows });
	}

	closeEdit(e, k) {
		const { editRows } = this.state;
		const { keyRole } = this.props;

		const rowIndex = editRows.findIndex((value) => Object.keys(value).includes(k.key));

		this.props.setValue([keyRole, 'keys', k.key, 'key'], editRows[rowIndex][k.key].key);
		this.props.setValue([keyRole, 'keys', k.key, 'weight'], editRows[rowIndex][k.key].weight);

		editRows.splice(rowIndex, 1);

		this.setState({
			editRows,
		});
	}

	async saveAddKey(e, num, key, weight, keyRole) {
		if (await this.props.validateField(keyRole, num.toString(), key, weight)) {
			return;
		}

		const { editedAddKeys } = this.state;

		editedAddKeys.push(num);

		this.setState({ editedAddKeys });
	}

	cancelAddKey(e, num) {
		const { keyRole } = this.props;

		this.props.removeKey([keyRole, 'keys', num.toString()]);
		this.props.cancelEdit(num);
	}

	removeAddkey(e, num) {
		const { keyRole } = this.props;

		this.props.removeKey([keyRole, 'keys', num.toString()]);
		this.props.cancelEdit(num);

		const { editedAddKeys } = this.state;

		editedAddKeys.splice(editedAddKeys.indexOf(num), 1);

		this.setState({ editedAddKeys });
	}

	editAddKey(e, num) {
		const { editedAddKeys } = this.state;

		editedAddKeys.splice(editedAddKeys.indexOf(num), 1);

		this.setState({ editedAddKeys });
	}

	renderPrivateKeyCell(k, editKey, editWeight, isEdit, key) {
		const { keyRole, data } = this.props;
		const { editedAddKeys, removedRows } = this.state;

		const keysLength = (data.length + editedAddKeys.length) - removedRows.length;

		return (
			<React.Fragment>
				<Table.Cell className={key ? 'key-hide' : 'key-show'} >
					<div className="field cell-wrap key-td">
						<Button
							className={classnames('icon', key ? 'icon-e-show' : 'icon-e-hide')}
							onClick={() => this.props.submit(keyRole, k.key)}
						/>
						{
							key ?
								<span className="key">{key.wif}</span> :
								<input
									tabIndex="-1"
									type="password"
									readOnly={!isEdit}
									className="key-input"
									value="0000000000000000000000000000000000000000000000000000000000000000"
								/>
						}
					</div>
				</Table.Cell>
				<Table.Cell>
					{
						(isEdit && keyRole !== 'memo') ? (
							<div className={classnames('field', { error: editWeight && editWeight.error })}>
								<input
									type="text"
									name={k.key}
									className="ui input"
									value={editWeight ? editWeight.value : ''}
									onChange={(e) => this.onInput(e, 'weight')}
									autoFocus
								/>
								<span className="error-message">{editWeight && editWeight.error}</span>
							</div>
						) : (
							<div className="td-txt">{editWeight ? editWeight.value : ''}</div>
						)
					}
				</Table.Cell>
				<Table.Cell>
					<div className="btn-container">
						{
							(!isEdit) ? (
								<React.Fragment>
									<button onClick={(e) => this.onEdit(e, k)} className="edit-row-btn" />
									{
										keysLength > 1
										&& <button onClick={(e) => this.onRemoveRow(e, k)} className="remove-row-btn" />
									}
								</React.Fragment>
							) : (
								<React.Fragment>
									<button onClick={(e) => this.onSaveRow(e, k, editKey, editWeight)} className="save-row-btn" />
									<button onClick={(e) => this.closeEdit(e, k)} className="cancel-row-changes" />
								</React.Fragment>
							)
						}
					</div>
				</Table.Cell>
			</React.Fragment>
		);
	}

	renderAddKey() {
		const {
			keys, keyRole, addKeys, data,
		} = this.props;

		const { editedAddKeys, removedRows } = this.state;

		const keysLength = (data.length + editedAddKeys.length) - removedRows.length;

		return (
			addKeys.map((num) => {
				const newKey = keys.getIn([keyRole, 'keys', num.toString(), 'key']);
				const newWeight = keys.getIn([keyRole, 'keys', num.toString(), 'weight']);

				const isSaved = this.state.editedAddKeys.includes(num);

				return (
					<Table.Row key={num} className={(!isSaved) ? 'is-edit' : ''}>
						<Table.Cell>
							{
								isSaved ?
									<div className="td-txt">{newKey ? newKey.value : ''}</div> :
									<div className={classnames('field', { error: newKey && newKey.error })}>
										<textarea
											className="i-textarea"
											name={num}
											onChange={(e) => this.onInput(e, 'key')}
											value={newKey ? newKey.value : ''}
										/>
										<span className="error-message">{newKey && newKey.error}</span>
									</div>
							}
						</Table.Cell>
						{
							<React.Fragment>
								<Table.Cell className="key-hide" />
								<Table.Cell>
									{
										isSaved ?
											<div className="td-txt">{newWeight ? newWeight.value : ''}</div>
											:
											<div className={classnames('field', { error: newWeight && newWeight.error })}>
												<input
													type="text"
													name={num}
													className="ui input"
													onChange={(e) => this.onInput(e, 'weight')}
													value={newWeight ? newWeight.value : ''}
												/>
												<span className="error-message">{newWeight && newWeight.error}</span>
											</div>
									}
								</Table.Cell>
								<Table.Cell>
									<div className="btn-container">
										{
											(isSaved) ? (
												<React.Fragment>
													<button onClick={(e) => this.editAddKey(e, num)} className="edit-row-btn" />
													{keysLength > 1 && <button onClick={(e) => this.removeAddkey(e, num)} className="remove-row-btn" />}
												</React.Fragment>
											) : (
												<React.Fragment>
													<button onClick={(e) => this.saveAddKey(e, num, newKey, newWeight, keyRole)} className="save-row-btn" />
													<button onClick={(e) => this.cancelAddKey(e, num)} className="cancel-row-changes" />
												</React.Fragment>
											)
										}
									</div>
								</Table.Cell>
							</React.Fragment>
						}
					</Table.Row>
				);
			})
		);
	}

	render() {

		const {
			data, keys, keyRole, privateKeys,
		} = this.props;

		return (
			<React.Fragment>
				{
					data.map((k) => {
						const editKey = keys.getIn([keyRole, 'keys', k.key, 'key']);
						const editWeight = keys.getIn([keyRole, 'keys', k.key, 'weight']);

						const isEdit = this.state.editRows.find((value) => Object.keys(value).includes(k.key));

						if (this.state.removedRows.includes(k.key)) {
							return null;
						}

						return (
							<Table.Row key={k.key} className={(isEdit) ? 'is-edit' : ''}>
								<Table.Cell>
									{
										(isEdit) ? (
											<div className={classnames('field', { error: editKey && editKey.error })}>
												<textarea
													className="i-textarea"
													name={k.key}
													onChange={(e) => this.onInput(e, 'key')}
													value={editKey ? editKey.value : ''}
												/>
												<span className="error-message">{editKey && editKey.error}</span>
											</div>
										) : (
											<div className="td-txt">{editKey ? editKey.value : ''}</div>
										)
									}
								</Table.Cell>
								{
									this.renderPrivateKeyCell(
										k,
										editKey,
										editWeight,
										isEdit,
										privateKeys.find((pKey) => pKey.publicKey === k.key),
									)
								}
							</Table.Row>
						);
					})
				}
				{
					this.renderAddKey()
				}
			</React.Fragment>
		);
	}

}

PermissionTableRow.propTypes = {
	data: PropTypes.array.isRequired,
	addKeys: PropTypes.array.isRequired,
	privateKeys: PropTypes.array.isRequired,
	keys: PropTypes.object.isRequired,
	keyRole: PropTypes.string.isRequired,
	resetAddKeys: PropTypes.bool.isRequired,
	firstFetch: PropTypes.bool.isRequired,
	unlockPrivateKey: PropTypes.func.isRequired,
	cancelEdit: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	set: PropTypes.func.isRequired,
	setError: PropTypes.func.isRequired,
	removeKey: PropTypes.func.isRequired,
	submit: PropTypes.func.isRequired,
	isChanged: PropTypes.func.isRequired,
	onAddKey: PropTypes.func.isRequired,
	validateField: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		keys: state.form.get(FORM_PERMISSION_KEY),
		firstFetch: state.form.getIn([FORM_PERMISSION_KEY, 'firstFetch']),
	}),
	(dispatch) => ({
		unlockPrivateKey: (value) => dispatch(unlockPrivateKey(value)),
		setValue: (fields, value) => dispatch(setInFormValue(FORM_PERMISSION_KEY, fields, value)),
		set: (field, value) => dispatch(setValue(FORM_PERMISSION_KEY, field, value)),
		setError: (fields, value) => dispatch(setInFormError(FORM_PERMISSION_KEY, fields, value)),
		removeKey: (fields) => dispatch(removeKey(FORM_PERMISSION_KEY, fields)),
		isChanged: () => dispatch(isChanged()),
		validateField: (role, keyTable, key, weight) =>
			dispatch(validateKey(role, keyTable, key, weight)),
	}),
)(PermissionTableRow);
