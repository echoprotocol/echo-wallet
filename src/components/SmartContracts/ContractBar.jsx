import React from 'react';
// import PropTypes from 'prop-types';
import { Popup, Dropdown, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import AmountField from '../Fields/AmountField';
import { ECHO_DOCS_LINK } from '../../constants/GlobalConstants';
import Toggle from '../Toggle';
import { FORM_CREATE_CONTRACT } from '../../constants/FormConstants';


class ContractBar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			searchText: '',
			supportedAssets: 'all',
			options: [],
		};
	}


	async assetSearchHanler(e, data) {
		this.setState({
			searchText: data.searchQuery,
		});
		const assetList = (await this.props.getAssetsList(data.searchQuery.toUpperCase()))
			.map((a, i) => ({
				key: a.id,
				text: a.symbol,
				value: i,
			}));
		this.setState({ options: assetList });
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
		const { searchText, supportedAssets, options } = this.state;
		const {
			fee, tokens, amount, currency, assets, isAvailableBalance, fees, ETHAccuracy,
		} = this.props;
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
						<Toggle
							onChange={() => this.props.setContractValue('ETHAccuracy', !this.props.ETHAccuracy)}
						/>
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
						<AmountField
							fees={fees}
							form={FORM_CREATE_CONTRACT}
							fee={fee}
							assets={assets}
							tokens={tokens}
							amount={amount}
							currency={currency}
							isAvailableBalance={isAvailableBalance}
							amountInput={this.props.amountInput}
							setFormError={this.props.setFormError}
							setFormValue={this.props.setFormValue}
							setValue={this.props.setValue}
							setDefaultAsset={this.props.setDefaultAsset}
							getTransferFee={this.props.getTransferFee}
							setContractFees={this.props.setContractFees}
						/>
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

ContractBar.propTypes = {
	fee: PropTypes.object,
	fees: PropTypes.array.isRequired,
	assets: PropTypes.object.isRequired,
	tokens: PropTypes.object.isRequired,
	amount: PropTypes.object.isRequired,
	currency: PropTypes.object,
	isAvailableBalance: PropTypes.bool.isRequired,
	ETHAccuracy: PropTypes.bool.isRequired,
	setContractValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	getAssetsList: PropTypes.func.isRequired,
};

ContractBar.defaultProps = {
	currency: null,
	fee: null,
};


export default ContractBar;
