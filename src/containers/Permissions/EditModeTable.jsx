import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Button } from 'semantic-ui-react';

import ViewModeRow from './ViewModeRow';
import EditModeThrashold from './EditModeThrashold';
import EditModeTableRow from './EditModeTableRow';



class ViewModeTable extends React.Component {

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
	// 			this.props.setValue([keyRole, 'keys', k.key, 'hasWif'], k.hasWif);
	// 		});
	// 	}

	// 	if (!_.isEqual(keys, prevKeys)) {
	// 		this.props.set('isChanged', this.props.isChanged());
	// 	}
	// }

	renderDescription() {
		const {
			data, description, headerLinkText, headerLinkUrl,
		} = this.props;

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
								<EditModeThrashold />
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
			data, keys, keyRole,
		} = this.props;

		return (
			<div className="list">
				<React.Fragment>
					{
						data.keys.map((k) => {
							// const { type, hasWif } = k;

							// const key = keys.getIn([keyRole, 'keys', k.key, 'key']);
							// const weight = keys.getIn([keyRole, 'keys', k.key, 'weight']);

							return (
								<EditModeTableRow key={k.key} type="keys" keyRole="active" />
							);
						})
					}
				</React.Fragment>
			</div>
		);
	}

	renderAddButtons() {
		return (
			<div className="list-panel">
				<Button
					className="main-btn"
					size="medium"
				>
					<Popup
						trigger={<span className="main-btn-popup">Add Account</span>}
						content="Provide access to send transaction to another account"
						className="inner-tooltip"
						position="bottom center"
						style={{ width: 380 }}
					/>
				</Button>
				<Button
					className="main-btn"
					size="medium"
				>
					<Popup
						trigger={<span className="main-btn-popup">Add public key</span>}
						content="Add an additional key to sign transactions"
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
	data: PropTypes.object.isRequired,
	description: PropTypes.string,
	keyRole: PropTypes.string.isRequired,
	keys: PropTypes.object.isRequired,
	firstFetch: PropTypes.bool.isRequired,
	setValue: PropTypes.func.isRequired,
	set: PropTypes.func.isRequired,
	isChanged: PropTypes.func.isRequired,
};

ViewModeTable.defaultProps = {
	description: null,
	advanced: null,
	title: null,
	headerLinkText: null,
	headerLinkUrl: null,
};


export default ViewModeTable;
