import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Button } from 'semantic-ui-react';
import _ from 'lodash';

import EditModeThreshold from './EditModeThreshold';
import EditModeTableRow from './EditModeTableRow';

class ViewModeTable extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			addedFields: [],
			removedRows: [],
		};
	}

	static getDerivedStateFromProps(nextProps) {
		if (nextProps.resetAddKeys) {
			return { addedFields: [], removedRows: [] };
		}

		return null;
	}

	componentDidUpdate(prevProps) {
		const {
			keys, firstFetch, data, keyRole,
		} = this.props;
		const { keys: prevKeys, firstFetch: prevFetch } = prevProps;

		if (
			(firstFetch !== prevFetch && firstFetch) ||
			(!_.isEqual(data.keys, prevProps.data.keys))
		) {
			data.keys.forEach((k) => {
				this.props.setValue([keyRole, k.type, k.key, 'key'], k.key);
				this.props.setValue([keyRole, k.type, k.key, 'weight'], k.weight);
				this.props.setValue([keyRole, k.type, k.key, 'type'], k.type);
			});
		}

		if (!_.isEqual(keys, prevKeys)) {
			this.props.set('isChanged', this.props.isChanged());
		}
	}

	onRemoveOriginField(key, type) {
		const { keyRole } = this.props;

		this.props.setValue([keyRole, type, key, 'remove'], true);

		const { removedRows } = this.state;

		removedRows.push(key);

		this.setState({ removedRows });

		this.props.setWif(keyRole, type, { target: { name: key, value: '' } });
	}

	setPublicKey(keyRole, type, e) {
		const field = e.target.name;
		const newValue = e.target.value;
		this.props.setValue([keyRole, 'keys', field, 'key'], newValue);

		if (!this.props.privateKeys[field]) {
			this.props.setWif(keyRole, type, {
				target: {
					name: field,
					value: '',
				},
			});
		}
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
		const index = num || (addedFields.length ? addedFields[addedFields.length - 1].num + 1 : 0);
		addedFields.push({ num: index, type });
		this.props.setValue([keyRole, type, index.toString(), 'key'], '');
		this.props.setValue([keyRole, type, index.toString(), 'weight'], '');
		this.props.setValue([keyRole, type, index.toString(), 'type'], type);

		this.setState({ addedFields });
	}

	removeField(num, type) {
		const { keyRole } = this.props;
		const { addedFields } = this.state;


		addedFields.splice(addedFields.findIndex((o) => o.num === num), 1);

		this.setState({ addedFields }, () => {
			this.props.setWif(keyRole, type, { target: { name: num.toString(), value: '' } });

			setTimeout(() => {
				this.props.removeKey([keyRole, type, num.toString()]);
			}, 0);
		});

	}

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

		const { addedFields, removedRows } = this.state;

		const keysLength = (data.keys.length + addedFields.length) - removedRows.length;

		return (
			<div className="list">
				<React.Fragment>
					{
						data.keys.map((k) => {
							if (this.state.removedRows.includes(k.key)) {
								return null;
							}
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
									removeKey={() => this.onRemoveOriginField(k.key, type)}
									setWif={(e) => setWif(keyRole, type, e)}
									setPublicKey={(e) => this.setPublicKey(keyRole, type, e)}
									setWeight={(e) => this.setWeight(keyRole, type, e)}
									setAccount={(e) => this.setAccount(keyRole, e)}
									showRemove={keysLength > 1}
								/>
							);
						})
					}
				</React.Fragment>
			</div>
		);
	}

	renderAddedFields() {
		const {
			keys, keyRole, data,
		} = this.props;

		const { addedFields, removedRows } = this.state;

		const keysLength = (data.keys.length + addedFields.length) - removedRows.length;

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
									removeKey={() => this.removeField(num, type)}
									setWif={(e) => setWif(keyRole, type, e)}
									setPublicKey={(e) => this.setPublicKey(keyRole, type, e)}
									setWeight={(e) => this.setWeight(keyRole, type, e)}
									setAccount={(e) => this.setAccount(keyRole, e)}
									showRemove={keysLength > 1}
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
						style={{ width: 300 }}
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
	setValue: PropTypes.func.isRequired,
	firstFetch: PropTypes.bool.isRequired,
	set: PropTypes.func.isRequired,
	isChanged: PropTypes.func.isRequired,
	setWif: PropTypes.func,
	removeKey: PropTypes.func,
};

ViewModeTable.defaultProps = {
	description: null,
	advanced: null,
	title: null,
	headerLinkText: null,
	headerLinkUrl: null,
	setWif: () => { },
	removeKey: () => { },
	addAccountButtonText: null,
	addAccountButtonTooltipText: null,
	addPublicKeyButtonText: null,
	addPublicKeyButtonTooltipText: null,
};


export default ViewModeTable;
