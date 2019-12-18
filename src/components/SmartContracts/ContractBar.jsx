import React from 'react';
// import PropTypes from 'prop-types';
import { Popup, Dropdown, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
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
		this.props.setFormError(FORM_CREATE_CONTRACT_OPTIONS, 'amount', null);
		this.setState({ searchText: assetSymbol });
	}

	onResetSupportedAsset() {
		this.setState({ searchText: '' });
		this.props.setFormValue(FORM_CREATE_CONTRACT_OPTIONS, 'supportedAsset', '');
		this.props.setValue(FORM_CREATE_CONTRACT_OPTIONS, 'supportedAssetRadio', SUPPORTED_ASSET_ALL);
	}

	goToExternalLink(e, link) {
		if (ELECTRON && window.shell) {
			e.preventDefault();
			window.shell.openExternal(link);
		}
	}

	async assetSearchHandler(e, data) {
		this.props.setFormValue(FORM_CREATE_CONTRACT_OPTIONS, 'supportedAsset', data.searchQuery);
		this.props.setFormError(FORM_CREATE_CONTRACT_OPTIONS, 'amount', null);
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
				<FormattedMessage id="smart_contract_page.create_contract_page.contract_deploy.eth_accuracy.popup_text" />
				<a
					href={ECHO_DOCS_LINK}
					className="link"
					target="_blank"
					rel="noopener noreferrer"
					onClick={(e) => this.goToExternalLink(e, ECHO_DOCS_LINK)}
				>
					<FormattedMessage id="smart_contract_page.create_contract_page.contract_deploy.eth_accuracy.popup_link" />
				</a>
			</div>
		);
	}

	render() {
		const {
			searchText, options, loading,
		} = this.state;
		const {
			assets, fees, form, intl,
		} = this.props;
		const assetsPopupInfo = intl.formatMessage({ id: 'smart_contract_page.create_contract_page.contract_deploy.supported_assets.popup_text' });
		const amountPopupInfo = intl.formatMessage({ id: 'smart_contract_page.create_contract_page.contract_deploy.deploying_amount.popup_text' });
		return (
			<div className="contract-bar">
				<h3 className="contract-bar-title">
					<FormattedMessage id="smart_contract_page.create_contract_page.contract_deploy.title" />
				</h3>
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
							<FormattedMessage id="smart_contract_page.create_contract_page.contract_deploy.eth_accuracy.title" />
						</div>
						<Toggle
							onChange={() => this.props.setValue(FORM_CREATE_CONTRACT_OPTIONS, 'ETHAccuracy', !form.get('ETHAccuracy'))}
						/>
					</li>
					<li className="param">
						<div className="param-key">
							<Popup
								trigger={<span className="icon-info" />}
								content={assetsPopupInfo}
								className="inner-tooltip"
								position="bottom center"
								style={{ width: 200 }}
							/>
							<FormattedMessage id="smart_contract_page.create_contract_page.contract_deploy.supported_assets.title" />
						</div>
						<div className="param-subline">
							<div className="radio-list">
								<Button
									className={classnames('radio', { checked: form.get('supportedAssetRadio') === SUPPORTED_ASSET_ALL })}
									onClick={() => this.onResetSupportedAsset()}
									content={
										<FormattedMessage id="smart_contract_page.create_contract_page.contract_deploy.supported_assets.all" />
									}
								/>
								<Button
									className={classnames('radio', { checked: form.get('supportedAssetRadio') === SUPPORTED_ASSET_CUSTOM })}
									onClick={() => { this.props.setValue(FORM_CREATE_CONTRACT_OPTIONS, 'supportedAssetRadio', SUPPORTED_ASSET_CUSTOM); }}
									content={
										<FormattedMessage id="smart_contract_page.create_contract_page.contract_deploy.supported_assets.choose_asset" />
									}
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
										{form.get('supportedAsset').error &&
										<span className="error-message">{intl.formatMessage({ id: form.get('supportedAsset').error })}</span>}
									</div>
							}
						</div>
					</li>
					<li className="param">
						<div className="param-key">
							<Popup
								trigger={<span className="icon-info" />}
								content={amountPopupInfo}
								className="inner-tooltip"
								position="bottom center"
								style={{ width: 200 }}
							/>
							<FormattedMessage id="smart_contract_page.create_contract_page.contract_deploy.deploying_amount.title" />
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
								intl={intl}
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
								content={
									<FormattedMessage id="smart_contract_page.create_contract_page.button_text" />
								}
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
	intl: PropTypes.any.isRequired,
};


export default injectIntl(ContractBar);
