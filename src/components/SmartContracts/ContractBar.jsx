import React from 'react';
// import PropTypes from 'prop-types';
import { Popup, Form } from 'semantic-ui-react';
import classnames from 'classnames';

import Toggle from '../Toggle';


class ContractBar extends React.Component {

	render() {

		return (
			<div className="contract-bar">
				<h3 className="contract-bar-title">Contract deploy parameters</h3>
				<ul className="params-list">
					<li className="param-line">
						<div className="param-key">
							<Popup
								trigger={<span className="icon-info" />}
								content="ETH Accuracy:"
								className="inner-tooltip"
								position="bottom right"
								style={{ width: 100 }}
							/>
							ETH Accuracy:
						</div>
						<Toggle />
					</li>
					<li className="param">
						<div className="param-key">
							<Popup
								trigger={<span className="icon-info" />}
								content="ETH Accuracy:"
								className="inner-tooltip"
								position="bottom right"
								style={{ width: 100 }}
							/>
							Supported assets:
						</div>
						<div className="param-subline">
							<div className="radio-list">
								<div className="radio">
									<input type="radio" id="all-option" checked name="selector" />
									<label className="label" htmlFor="all-option">
										<span className="label-text">All</span>
									</label>
								</div>
								<div className="radio">
									<input type="radio" id="custom-option" name="selector" />
									<label className="label" htmlFor="custom-option">
										<span className="label-text">Choose asset</span>
									</label>
								</div>
							</div>
							<Form.Field className={classnames('error-wrap', { error: false })}>
								<input
									type="text"
									placeholder="Asset name"
									name="asset-name"
									onChange={() => {}}
								/>
								{
									false && <span className="error-message">some error</span>
								}
							</Form.Field>
						</div>
					</li>
					<li className="param">
						<div className="param-key">
							<Popup
								trigger={<span className="icon-info" />}
								content="ETH Accuracy:"
								className="inner-tooltip"
								position="bottom right"
								style={{ width: 100 }}
							/>
							Deploying amount:
						</div>
					</li>
				</ul>
			</div>
		);
	}

}

ContractBar.propTypes = {};

ContractBar.defaultProps = {};


export default ContractBar;
