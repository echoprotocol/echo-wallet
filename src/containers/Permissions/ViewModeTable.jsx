import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

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
				this.props.setValue([keyRole, 'keys', k.key, 'key'], k.key);
				this.props.setValue([keyRole, 'keys', k.key, 'weight'], k.weight);
				this.props.setValue([keyRole, 'keys', k.key, 'type'], k.type);
				this.props.setValue([keyRole, 'keys', k.key, 'hasWif'], k.hasWif);
			});
		}

		if (!_.isEqual(keys, prevKeys)) {
			this.props.set('isChanged', this.props.isChanged());
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
			data, title, advanced,
		} = this.props;
		return (
			<div className="list-header">
				{
					title && <h3 className="list-header-title">{title}</h3>
				}
				{
					advanced && <span className="list-header-advanced">{advanced}</span>
				}
				{
					data.threshold && (
						<div className="list-header-info">
							<span className="icon-info" />
							<ViewModeThreshold defaultThreshold={data.threshold} />
						</div>
					)
				}
			</div>
		);
	}

	render() {
		const {
			data, keys, keyRole,
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

									const key = keys.getIn([keyRole, 'keys', k.key, 'key']);
									const weight = keys.getIn([keyRole, 'keys', k.key, 'weight']);

									return (
										<ViewModeRow
											key={k.key}
											subject={key}
											weight={weight}
											type={type}
											hasWif={hasWif}
											keyRole={keyRole}
											addWif={() => { }}
											viewWif={() => { }}
										/>
									);
								})
							}
						</React.Fragment>
					</div>
				</div>
				{/* <div className="list-wrap">
				
					<div className="list-description">
						EchoRand Key is used for participating in blocks generation and for signing
						sidechain transactions by committee members.
						<a className="list-header-link" href=""> Know more in Echo Docs</a>
					</div>
					<div className="list">
						<div className="list-item">
							<div className="list-item-content">
								<div className="list-item-value">8BTS5EXBBsHfr8c3yWVpkeVCezi7Ywm6pTJ7qV1BDPsrpJUaL2U5Q</div>
							</div>
							<div className="list-item-panel">
								<Button
									basic
									className="txt-btn"
									content="VIEW WIF"
								/>
							</div>
						</div>
					</div>
				</div> */}
			</div>
		);
	}

}

ViewModeTable.propTypes = {
	table: PropTypes.string.isRequired,
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
