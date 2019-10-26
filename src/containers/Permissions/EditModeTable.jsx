import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Button } from 'semantic-ui-react';

import EditModeThreshold from './EditModeThreshold';
import EditModeTableRow from './EditModeTableRow';

class ViewModeTable extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			addedFields: [],
		};
	}

	static getDerivedStateFromProps(nextProps) {
		if (nextProps.resetAddKeys) {
			return { addedFields: [] };
		}

		return null;
	}


	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		editRows: [],
	// 		removedRows: [],
	// 		editedAddKeys: [],
	// 	};

	// 	// this.onEdit = this.onEdit.bind(this);
	// 	// this.closeEdit = this.closeEdit.bind(this);
	// }

	// static getDerivedStateFromProps(nextProps, prevState) {
	// 	const {
	// 		keyRole, keys, data, addedFields,
	// 	} = nextProps;

	// 	const keysLength = prevState.editedAddKeys.length;
	// 	const editedAddKeys = [];

	// 	if (!keysLength && !addedFields.length && keys.getIn([keyRole, 'keys']).size - data.length !== keysLength) {
	// 		keys.getIn([keyRole, 'keys']).mapEntries(([key, value]) => {

	// 			if (Number.isNaN(Number(key)) || value || !value.get('key').value || !value.get('weight').value) {
	// 				return;
	// 			}

	// 			nextProps.onAddKey(parseInt(key, 10));
	// 			editedAddKeys.push(parseInt(key, 10));
	// 		});
	// 	}

	// 	if (nextProps.resetAddKeys) {
	// 		return {
	// 			editedAddKeys: [],
	// 			removedRows: [],
	// 		};
	// 	}

	// 	if (editedAddKeys.length) {
	// 		return { editedAddKeys };
	// 	}

	// 	return null;
	// }

	// onEdit(e, k) {
	// 	const { keyRole, keys } = this.props;
	// 	const { editRows } = this.state;
	// 	const editKey = keys.getIn([keyRole, 'keys', k.key, 'key']);
	// 	const editWeight = keys.getIn([keyRole, 'keys', k.key, 'weight']);

	// 	editRows.push({ [k.key]: { key: editKey.value, weight: editWeight.value } });

	// 	this.setState({
	// 		editRows,
	// 	});
	// }

	// componentDidUpdate(prevProps) {
	// 	const {
	// 		keys, firstFetch, data, keyRole,
	// 	} = this.props;
	// 	const { keys: prevKeys, firstFetch: prevFetch } = prevProps;

	// 	if (
	// 		(firstFetch !== prevFetch && firstFetch) ||
	// 		(data.keys.length !== prevProps.data.keys.length)
	// 	) {
	// 		data.keys.forEach((k) => {
	// 			this.props.setValue([keyRole, 'keys', k.key, 'key'], k.key);
	// 			this.props.setValue([keyRole, 'keys', k.key, 'weight'], k.weight);
	// 			this.props.setValue([keyRole, 'keys', k.key, 'type'], k.type);
	// 		});
	// 	}

	// 	if (!_.isEqual(keys, prevKeys)) {
	// 		this.props.set('isChanged', this.props.isChanged());
	// 	}
	// }

	// async onSaveRow(e, k, key, weight) {
	// 	if (await this.props.validateField(k.role, k.key, key, weight)) {
	// 		return;
	// 	}

	// 	const { editRows } = this.state;

	// 	editRows.splice(editRows.findIndex((value) => Object.keys(value).includes(k.key)), 1);

	// 	this.setState({
	// 		editRows,
	// 	});
	// }

	// onRemoveRow(e, k) {
	// 	const { keyRole } = this.props;

	// 	this.props.setValue([keyRole, 'keys', k.key, 'remove'], true);

	// 	const { removedRows } = this.state;

	// 	removedRows.push(k.key);

	// 	this.setState({ removedRows });
	// }

	onInput(e, type) {
		e.preventDefault();
		const { keyRole } = this.props;

		const field = e.target.name;
		const value = e.target.value.trim();

		this.props.setValue([keyRole, 'keys', field, type], value);
	}

	setPublicKey(keyRole, e) {
		const field = e.target.name;
		const newValue = e.target.value;
		this.props.setValue([keyRole, 'keys', field, 'key'], newValue);
	}

	setWeight(keyRole, type, e) {
		const field = e.target.name;
		const newValue = e.target.value;
		this.props.setValue([keyRole, type, field, 'weight'], newValue);
	}

	setAccount(keyRole, e) {
		const field = e.target.name;
		const newValue = e.target.value;
		this.props.setValue([keyRole, 'accounts', field, 'key'], newValue);
	}

	setThreshold(keyRole, e) {
		const field = e.target.name;
		const newValue = e.target.value;
		this.props.setValue([keyRole, field], newValue);
	}

	addNewField(num, type) {
		const { keyRole } = this.props;
		const { addedFields } = this.state;

		const index = num || (addedFields.length ? addedFields.length : 0);
		addedFields.push({ num: index, type });
		this.props.setValue([keyRole, type, index.toString(), 'key'], '');
		this.props.setValue([keyRole, type, index.toString(), 'weight'], '');
		this.props.setValue([keyRole, type, index.toString(), 'type'], type);

		this.setState({ addedFields });
	}

	removeField(num) {
		const { addedFields } = this.state;

		addedFields.splice(addedFields.indexOf(num), 1);

		this.setState({ addedFields });
	}

	// async saveAddKey(e, num, key, weight, keyRole) {
	// 	if (await this.props.validateField(keyRole, num.toString(), key, weight)) {
	// 		return;
	// 	}

	// 	const { editedAddKeys } = this.state;

	// 	editedAddKeys.push(num);

	// 	this.setState({ editedAddKeys });
	// }

	// cancelAddKey(e, num) {
	// 	const { keyRole } = this.props;

	// 	this.props.removeKey([keyRole, 'keys', num.toString()]);
	// 	this.props.cancelEdit(num);
	// }

	// removeAddkey(e, num) {
	// 	const { keyRole } = this.props;

	// 	this.props.removeKey([keyRole, 'keys', num.toString()]);
	// 	this.props.cancelEdit(num);

	// 	const { editedAddKeys } = this.state;

	// 	editedAddKeys.splice(editedAddKeys.indexOf(num), 1);

	// 	this.setState({ editedAddKeys });
	// }

	// editAddKey(e, num) {
	// 	const { editedAddKeys } = this.state;

	// 	editedAddKeys.splice(editedAddKeys.indexOf(num), 1);

	// 	this.setState({ editedAddKeys });
	// }

	// closeEdit(e, k) {
	// 	const { editRows } = this.state;
	// 	const { keyRole } = this.props;

	// 	const rowIndex = editRows.findIndex((value) => Object.keys(value).includes(k.key));

	// 	this.props.setValue([keyRole, 'keys', k.key, 'key'], editRows[rowIndex][k.key].key);
	// 	this.props.setValue([keyRole, 'keys', k.key, 'weight'], editRows[rowIndex][k.key].weight);

	// 	editRows.splice(rowIndex, 1);

	// 	this.setState({
	// 		editRows,
	// 	});
	// }


	renderDescription() {
		const {
			data, description, headerLinkText, headerLinkUrl, keys, keyRole,
		} = this.props;

		const threshold = keys.getIn([keyRole, 'threshold']);

		return (
			(description && headerLinkText && headerLinkUrl) ? (
				<div className="list-description">
					{description}
					<a
						className="list-header-link"
						href={headerLinkUrl}
						target="_blank"
						rel="noreferrer noopener"
					>
						{headerLinkText}
					</a>
				</div>
			) : (
				<div className="list-header-row">
					{
						description && (
							<div className="list-header-col">
								<div className="list-description">{description}</div>
							</div>
						)
					}
					{
						data.threshold && (
							<div className="list-header-col">
								<EditModeThreshold
									defaultThreshold={data.threshold}
									threshold={threshold}
									setThreshold={(e) => this.setThreshold(keyRole, e)}
								/>
							</div>
						)
					}
				</div>
			)
		);
	}

	renderListHeader() {
		const {
			title, advanced,
		} = this.props;

		return (
			<React.Fragment>
				<div className="list-header">
					{
						title && <h3 className="list-header-title">{title}</h3>
					}
					{
						advanced && <span className="list-header-advanced">{advanced}</span>
					}
				</div>
				{
					this.renderDescription()
				}
			</React.Fragment>
		);
	}

	renderList() {
		const {
			data, keys, keyRole, privateKeys, setWif,
		} = this.props;

		return (
			<div className="list">
				<React.Fragment>
					{
						data.keys.map((k) => {
							const { type } = k;

							const key = keys.getIn([keyRole, type, k.key, 'key']);
							const weight = keys.getIn([keyRole, type, k.key, 'weight']);
							const wif = privateKeys[k.key];

							return (
								<EditModeTableRow
									key={k.key}
									name={k.key}
									subject={key}
									wif={wif}
									weight={weight}
									type={type}
									keyRole={keyRole}
									removeKey={() => { }}
									validateField={() => {}}
									setWif={(e) => setWif(keyRole, type, e)}
									setPublicKey={(e) => this.setPublicKey(keyRole, e)}
									setWeight={(e) => this.setWeight(keyRole, type, e)}
									setAccount={(e) => this.setAccount(keyRole, e)}
								/>
							);
						})
					}
				</React.Fragment>
			</div>
		);
	}

	renderAddButtons() {
		const {
			keyRole,
			addAccountButtonText,
			addAccountButtonTooltipText,
			addPublicKeyButtonText,
			addPublicKeyButtonTooltipText,
		} = this.props;

		return keyRole === 'active' && (
			<div className="list-panel">
				<Button
					className="main-btn"
					size="medium"
					onClick={() => this.addNewField(undefined, 'accounts')}
				>
					<Popup
						trigger={<span className="main-btn-popup">{addAccountButtonText}</span>}
						content={addAccountButtonTooltipText}
						className="inner-tooltip"
						position="bottom center"
						style={{ width: 380 }}
					/>
				</Button>
				<Button
					className="main-btn"
					size="medium"
					onClick={() => this.addNewField(undefined, 'keys')}
				>
					<Popup
						trigger={<span className="main-btn-popup">{addPublicKeyButtonText}</span>}
						content={addPublicKeyButtonTooltipText}
						className="inner-tooltip"
						position="bottom center"
						style={{ width: 300 }}
					/>
				</Button>
			</div>
		);
	}

	renderAddedFields() {
		const {
			keys, keyRole,
		} = this.props;

		const { addedFields } = this.state;

		// const keysLength = (data.length + editedAddKeys.length) - removedRows.length;

		const {
			privateKeys, setWif,
		} = this.props;

		return (
			<div className="list">
				<React.Fragment>
					{
						addedFields.map(({ num, type }) => {

							const key = keys.getIn([keyRole, type, num.toString(), 'key']);
							const weight = keys.getIn([keyRole, type, num.toString(), 'weight']);
							const wif = privateKeys[num];

							return (
								<EditModeTableRow
									key={num}
									name={num.toString()}
									subject={key}
									wif={wif}
									weight={weight}
									type={type}
									keyRole={keyRole}
									removeKey={() => this.removeField(num)}
									validateField={() => {}}
									setWif={(e) => setWif(keyRole, type, e)}
									setPublicKey={(e) => this.setPublicKey(keyRole, e)}
									setWeight={(e) => this.setWeight(keyRole, type, e)}
									setAccount={(e) => this.setAccount(keyRole, e)}
								/>
							);
						})
					}
				</React.Fragment>
			</div>
		);

		// return (
		// 	addedFields.map((num) => {
		// 		const newKey = keys.getIn([keyRole, 'keys', num.toString(), 'key']);
		// 		const newWeight = keys.getIn([keyRole, 'keys', num.toString(), 'weight']);

		// 		const isSaved = this.state.editedAddKeys.includes(num);

		// 		return (
		// 			<Table.Row key={num} className={(!isSaved) ? 'is-edit' : ''}>
		// 				<Table.Cell>
		// 					{
		// 						isSaved ?
		// 							<div className="td-txt">{newKey ? newKey.value : ''}</div> :
		// 							<div className={classnames('field', { error: newKey && newKey.error })}>
		// 								<textarea
		// 									className="i-textarea"
		// 									name={num}
		// 									onChange={(e) => this.onInput(e, 'key')}
		// 									value={newKey ? newKey.value : ''}
		// 								/>
		// 								<span className="error-message">{newKey && newKey.error}</span>
		// 							</div>
		// 					}
		// 				</Table.Cell>
		// 				{
		// 					<React.Fragment>
		// 						<Table.Cell className="key-hide" />
		// 						<Table.Cell>
		// 							{
		// 								isSaved ?
		// 									<div className="td-txt">{newWeight ? newWeight.value : ''}</div>
		// 									:
		// 									<div className={classnames('field', { error: newWeight && newWeight.error })}>
		// 										<input
		// 											type="text"
		// 											name={num}
		// 											className="ui input"
		// 											onChange={(e) => this.onInput(e, 'weight')}
		// 											value={newWeight ? newWeight.value : ''}
		// 										/>
		// 										<span className="error-message">{newWeight && newWeight.error}</span>
		// 									</div>
		// 							}
		// 						</Table.Cell>
		// 						<Table.Cell>
		// 							<div className="btn-container">
		// 								{
		// 									(isSaved) ? (
		// 										<React.Fragment>
		// 											<button onClick={(e) => this.editAddKey(e, num)} className="edit-row-btn" />
		// 											{keysLength > 1 && <button onClick={(e) => this.removeAddkey(e, num)} className="remove-row-btn" />}
		// 										</React.Fragment>
		// 									) : (
		// 										<React.Fragment>
		// 											<button onClick={(e) => this.saveAddKey(e, num, newKey, newWeight, keyRole)} className="save-row-btn" />
		// 											<button onClick={(e) => this.cancelAddKey(e, num)} className="cancel-row-changes" />
		// 										</React.Fragment>
		// 									)
		// 								}
		// 							</div>
		// 						</Table.Cell>
		// 					</React.Fragment>
		// 				}
		// 			</Table.Row>
		// 		);
		// 	})
		// );
	}

	render() {
		return (
			<div className="edit-mode-wrap">
				<div className="list-wrap">
					{
						this.renderListHeader()
					}
					{
						this.renderList()
					}
					{
						this.renderAddedFields()
					}
					{
						this.renderAddButtons()
					}
				</div>
			</div>
		);
	}

}

ViewModeTable.propTypes = {
	title: PropTypes.string,
	advanced: PropTypes.string,
	headerLinkText: PropTypes.string,
	headerLinkUrl: PropTypes.string,
	addAccountButtonText: PropTypes.string,
	addAccountButtonTooltipText: PropTypes.string,
	addPublicKeyButtonText: PropTypes.string,
	addPublicKeyButtonTooltipText: PropTypes.string,
	data: PropTypes.object.isRequired,
	description: PropTypes.string,
	keyRole: PropTypes.string.isRequired,
	keys: PropTypes.object.isRequired,
	privateKeys: PropTypes.object.isRequired,
	// firstFetch: PropTypes.bool.isRequired,
	setValue: PropTypes.func.isRequired,
	// set: PropTypes.func.isRequired,
	// isChanged: PropTypes.func.isRequired,
	// addAccount: PropTypes.func,
	// addPublicKey: PropTypes.func,
	setWif: PropTypes.func,
	setThreashold: PropTypes.func,
};

ViewModeTable.defaultProps = {
	description: null,
	advanced: null,
	title: null,
	headerLinkText: null,
	headerLinkUrl: null,
	// addAccount: () => {},
	// addPublicKey: () => {},
	setWif: () => {},
	setThreashold: () => {},
	addAccountButtonText: null,
	addAccountButtonTooltipText: null,
	addPublicKeyButtonText: null,
	addPublicKeyButtonTooltipText: null,
};


export default ViewModeTable;
