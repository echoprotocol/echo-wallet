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

	render() {
		const {
			data, keys, keyRole, description,
		} = this.props;
		return (

			<div className="view-mode-wrap">
				<div className="info-text">
					{description}
				</div>
				<div className="list-wrap">
					<div className="list-header">
						<h3 className="list-header-title">Public Keys and Accounts</h3>
						<div className="list-header-info">
							<span className="icon-info" />
							<ViewModeThreshold defaultThreshold={data.threshold} />
						</div>
					</div>
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
											addWif={() => {}}
											viewWif={() => {}}
										/>
									);
								})
							}
						</React.Fragment>
					</div>
				</div>
				<div className="list-wrap">
					<div className="list-header">
						<h3 className="list-header-title">EchoRand Key</h3>
						<span className="list-header-advanced">(advanced)</span>
					</div>
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
				</div>
			</div>
		);
	}

}

ViewModeTable.propTypes = {
	table: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	noInput: PropTypes.bool,
	noBtn: PropTypes.bool,
	description: PropTypes.string,
	keyRole: PropTypes.string.isRequired,
	keys: PropTypes.object.isRequired,
	submit: PropTypes.func.isRequired,
	firstFetch: PropTypes.bool.isRequired,
	setValue: PropTypes.func.isRequired,
	set: PropTypes.func.isRequired,
	isChanged: PropTypes.func.isRequired,
};

ViewModeTable.defaultProps = {
	noInput: false,
	noBtn: false,
	description: null,
};


export default ViewModeTable;
