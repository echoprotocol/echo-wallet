import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import _ from 'lodash';

import ViewModeRow from './ViewModeRow';
import ViewModeThreshold from './ViewModeThreshold';


class ViewModeTable extends React.Component {

	componentDidUpdate(prevProps) {
		const {
			keys, firstFetch, data, keyRole,
		} = this.props;
		const { keys: prevKeys, firstFetch: prevFetch } = prevProps;

		if (
			(firstFetch !== prevFetch && firstFetch) ||
			(data.keys.length !== prevProps.data.keys.length)
		) {
			data.keys.forEach((k) => {
				this.props.setValue([keyRole, k.type, k.key, 'key'], k.key);
				this.props.setValue([keyRole, k.type, k.key, 'weight'], k.weight);
				this.props.setValue([keyRole, k.type, k.key, 'type'], k.type);
				this.props.setValue([keyRole, k.type, k.key, 'hasWif'], k.hasWif);
			});
		}

		if (!_.isEqual(keys, prevKeys)) {
			this.props.set('isChanged', this.props.isChanged());
		}
	}

	goToExternalLink(e, link) {
		if (ELECTRON && window.shell) {
			e.preventDefault();
			window.shell.openExternal(link);
		}
	}

	renderDescription() {
		const { description, headerLinkText, headerLinkUrl } = this.props;

		return (
			(description && !headerLinkText && !headerLinkUrl) && <div className="info-text">{description}</div>
		);
	}

	renderLinkDescription() {
		const { description, headerLinkText, headerLinkUrl } = this.props;

		return (
			(description && headerLinkText && headerLinkUrl) && (
				<div className="list-description">
					{description}
					<a
						className="list-header-link"
						href={headerLinkUrl}
						target="_blank"
						onClick={(e) => this.goToExternalLink(e, headerLinkUrl)}
						rel="noreferrer noopener"
					>
						{headerLinkText}
					</a>
				</div>
			)
		);
	}

	renderListHeader() {
		const {
			data, title, advanced, tooltipText,
		} = this.props;
		return (
			<div className="list-header">
				{
					title && <h3 className="list-header-title">{title}</h3>
				}
				{
					advanced && <span className="list-header-advanced">{advanced}</span>
				}
				<div className="list-header-info">

					{
						tooltipText && (
							<Popup
								trigger={<span className="inner-tooltip-trigger icon-info" />}
								content={tooltipText}
								className="inner-tooltip"
								position="bottom center"
								style={{ width: 420 }}
							/>
						)
					}
					{
						data.threshold && <ViewModeThreshold defaultThreshold={data.threshold} />
					}
				</div>

			</div>
		);
	}

	render() {
		const {
			data, keys, keyRole, showWif, addWif,
		} = this.props;
		return (
			<div className="view-mode-wrap">
				{
					this.renderDescription()
				}
				<div className="list-wrap">
					{
						this.renderListHeader()
					}
					{
						this.renderLinkDescription()
					}
					<div className="list">
						<React.Fragment>
							{
								data.keys.map((k) => {
									const { type, hasWif } = k;

									const key = keys.getIn([keyRole, type, k.key, 'key']);
									const weight = keys.getIn([keyRole, type, k.key, 'weight']);

									return (
										<ViewModeRow
											key={k.key}
											subject={key}
											weight={weight}
											type={type}
											hasWif={hasWif}
											keyRole={keyRole}
											addWif={(publicKey) => addWif(publicKey, keyRole)}
											showWif={showWif}
										/>
									);
								})
							}
						</React.Fragment>
					</div>
				</div>
			</div>
		);
	}

}

ViewModeTable.propTypes = {
	title: PropTypes.string,
	tooltipText: PropTypes.string,
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
	showWif: PropTypes.func.isRequired,
	addWif: PropTypes.func.isRequired,
};

ViewModeTable.defaultProps = {
	description: null,
	advanced: null,
	title: null,
	headerLinkText: null,
	headerLinkUrl: null,
	tooltipText: null,
};


export default ViewModeTable;
