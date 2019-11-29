import React from 'react';
// import PropTypes from 'prop-types';
import { Popup, Dropdown, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import AmountField from '../Fields/AmountField';
import { ECHO_DOCS_LINK } from '../../constants/GlobalConstants';
import Toggle from '../Toggle';

import { FORM_CREATE_CONTRACT_OPTIONS } from '../../constants/FormConstants';
import TransactionScenario from '../../containers/TransactionScenario';
import { SUPPORTED_ASSET_ALL, SUPPORTED_ASSET_CUSTOM } from '../../constants/ContractsConstants';


class ContractBar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			searchText: '',
			options: [],
			timeout: null,
			loading: false,
		};
	}

	onChangeAsset(assetSymbol) {
		this.props.setFormValue(FORM_CREATE_CONTRACT_OPTIONS, 'supportedAsset', assetSymbol);
		this.setState({ searchText: assetSymbol });
	}

	onResetSupportedAsset() {
		this.setState({ searchText: '' });
		this.props.setFormValue(FORM_CREATE_CONTRACT_OPTIONS, 'supportedAsset', '');
		this.props.setValue(FORM_CREATE_CONTRACT_OPTIONS, 'supportedAssetRadio', SUPPORTED_ASSET_ALL);
	}

	async assetSearchHandler(e, data) {
		this.props.setFormValue(FORM_CREATE_CONTRACT_OPTIONS, 'supportedAsset', data.searchQuery);
		this.setState({
			searchText: data.searchQuery,
			loading: true,
		});
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}
		this.setState({
			timeout: setTimeout(async () => {
				const assetList = (await this.props.getAssetsList(data.searchQuery.toUpperCase()))
					.map((a) => ({
						key: a.id,
						text: a.symbol,
						value: a.symbol,
					}));
				this.setState({
					options: assetList,
					loading: false,
				});
			}, 300),
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
		const {
			searchText, options, loading,
		} = this.state;
		const {
			assets, fees, form,
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
							onChange={() => this.props.setValue(FORM_CREATE_CONTRACT_OPTIONS, 'ETHAccuracy', !form.get('ETHAccuracy'))}
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
									className={classnames('radio', { checked: form.get('supportedAssetRadio') === SUPPORTED_ASSET_ALL })}
									onClick={() => this.onResetSupportedAsset()}
									content="All"
								/>
								<Button
									className={classnames('radio', { checked: form.get('supportedAssetRadio') === SUPPORTED_ASSET_CUSTOM })}
									onClick={() => { this.props.setValue(FORM_CREATE_CONTRACT_OPTIONS, 'supportedAssetRadio', SUPPORTED_ASSET_CUSTOM); }}
									content="Choose asset"
								/>
							</div>
							{
								form.get('supportedAssetRadio') === SUPPORTED_ASSET_CUSTOM &&
									<div className={classnames('error-wrap ', { error: form.get('supportedAsset').error })}>
										<Dropdown
											icon={false}
											className={classnames({ empty: !searchText || loading })}
											options={(searchText && !loading) ? options : []}
											searchQuery={searchText}
											search
											selection
											fluid
											text={searchText || 'Asset name'}
											onSearchChange={(e, data) => this.assetSearchHandler(e, data)}
											placeholder="Asset name"
											selectOnNavigation={false}
											minCharacters={0}
											noResultsMessage={searchText ? 'No results are found' : null}
											onChange={(e, { value }) => this.onChangeAsset(value)}
										/>
										{form.get('supportedAsset').error && <span className="error-message">{form.get('supportedAsset').error}</span>}
									</div>
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
						<div className="field-wrap">
							<AmountField
								fees={fees}
								form={FORM_CREATE_CONTRACT_OPTIONS}
								assets={assets}
								amount={form.get('amount')}
								currency={form.get('currency')}
								isAvailableBalance={form.get('isAvailableBalance')}
								amountInput={(value, currency, name) => {
									this.props.amountInput(FORM_CREATE_CONTRACT_OPTIONS, value, currency, name);
								}}
								setFormError={(field, value) => {
									this.props.setFormError(FORM_CREATE_CONTRACT_OPTIONS, field, value);
								}}
								setFormValue={(field, value) => {
									this.props.setFormValue(FORM_CREATE_CONTRACT_OPTIONS, field, value);
								}}
								setValue={(field, value) => {
									this.props.setValue(FORM_CREATE_CONTRACT_OPTIONS, field, value);
								}}
								setDefaultAsset={() => {
									this.props.setDefaultAsset(FORM_CREATE_CONTRACT_OPTIONS);
								}}
							/>
						</div>
					</li>
				</ul>
				<TransactionScenario handleTransaction={() => this.props.createContract()}>
					{
						(submit) => (
							<Button
								type="button"
								className="main-btn"
								content="CREATE SMART CONTRACT"
								onClick={submit}
								disabled={form.get('compileLoading')}
							/>
						)
					}
				</TransactionScenario>
			</div>
		);
	}

}

ContractBar.propTypes = {
	fees: PropTypes.array.isRequired,
	form: PropTypes.object.isRequired,
	assets: PropTypes.object.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	getAssetsList: PropTypes.func.isRequired,
	createContract: PropTypes.func.isRequired,
};


export default ContractBar;
