import React from 'react';
// import PropTypes from 'prop-types';
import { Popup, Dropdown, Button } from 'semantic-ui-react';
import classnames from 'classnames';
import { ECHO_DOCS_LINK } from '../../constants/GlobalConstants';
import Toggle from '../Toggle';


class ContractBar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			searchText: '',
			supportedAssets: 'all',
		};
	}

	assetSearchHanler(e, data) {
		this.setState({
			searchText: data.searchQuery,
		});
	}

	renderAccuracyTrigger() {
		return (
			<div className="tooltip">
				The option allows to interpret ECHO assets as ETH.
				The amount will be automatically recalculated to the 1e18 precision.

				<a
					href={ECHO_DOCS_LINK}
					className="link"
					target="_blank"
					rel="noopener noreferrer"
				>
					Read more
				</a>
			</div>
		);
	}
	render() {
		const options = [
			{ key: 1, text: 'Choice 1', value: 1 },
			{ key: 2, text: 'Choice 2', value: 2 },
			{ key: 3, text: 'Choice 3', value: 3 }];
		const { searchText, supportedAssets } = this.state;
		return (
			<div className="contract-bar">
				<h3 className="contract-bar-title">Contract deploy parameters</h3>
				<ul className="params-list">
					<li className="param-line">
						<div className="param-key">
							<Popup
								trigger={<span className="icon-info" />}
								content={this.renderAccuracyTrigger()}
								className="tooltip-wrap"
								position="bottom center"
								hoverable
								style={{ width: 200 }}
							/>
							ETH Accuracy:
						</div>
						<Toggle />
					</li>
					<li className="param">
						<div className="param-key">
							<Popup
								trigger={<span className="icon-info" />}
								content="You can specify assets to be supported by your contract."
								className="inner-tooltip"
								position="bottom center"
								style={{ width: 200 }}
							/>
							Supported assets:
						</div>
						<div className="param-subline">
							<div className="radio-list">
								<Button
									className={classnames('radio', { checked: supportedAssets === 'all' })}
									onClick={() => { this.setState({ supportedAssets: 'all' }); }}
									content="All"
								/>
								<Button
									className={classnames('radio', { checked: supportedAssets === 'custom' })}
									onClick={() => { this.setState({ supportedAssets: 'custom' }); }}
									content="Choose asset"
								/>
							</div>
							{
								supportedAssets === 'custom' &&
								<Dropdown
									icon={false}
									className={classnames({ empty: !searchText })}
									options={searchText ? options : []}
									searchQuery={searchText}
									search
									selection
									fluid
									text={searchText || 'Asset name'}
									onSearchChange={(e, data) => this.assetSearchHanler(e, data)}
									placeholder="Asset name"
									selectOnNavigation={false}
									minCharacters={0}
									noResultsMessage={searchText ? 'No results are found' : null}
								/>
							}
						</div>
					</li>
					<li className="param">
						<div className="param-key">
							<Popup
								trigger={<span className="icon-info" />}
								content="You can specify the amount to be sent with contract creation. Leave blank if the constructor of your contract is not payable."
								className="inner-tooltip"
								position="bottom center"
								style={{ width: 200 }}
							/>
							Deploying amount:
						</div>
					</li>
				</ul>
				<Button
					type="button"
					className="main-btn"
					content="CREATE SMART CONTRACT"
				/>
			</div>
		);
	}

}

ContractBar.propTypes = {};

ContractBar.defaultProps = {};


export default ContractBar;
