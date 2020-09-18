import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import classnames from 'classnames';
import { Dropdown } from 'semantic-ui-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/webpack-resolver';

import { FORM_CREATE_CONTRACT_SOURCE_CODE } from '../../constants/FormConstants';

class SourceCode extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			timeout: null,
			isDropdownUpdward: false,
			isAceError: false,
			useWorker: false,
		};
	}

	componentDidMount() {
		this.props.setDefaultAsset(FORM_CREATE_CONTRACT_SOURCE_CODE);

		this.setDropdownUpwardState();

		window.onresize = () => {
			this.setDropdownUpwardState();
		};
	}

	onEditorLoad(editor) {
		const { form } = this.props;
		const annotations = form.get('editorWorker') && !form.get('compileLoading') ? form.get('annotations') : [];
		editor.getSession().setAnnotations(annotations);
		editor.getSession().setUseWorker(false);
		editor.renderer.setScrollMargin(16, 14);
		editor.renderer.setPadding(22);
	}

	onChange(value) {
		const { timeout } = this.state;
		const { form } = this.props;

		this.props.setFormValue(FORM_CREATE_CONTRACT_SOURCE_CODE, 'code', value);

		if (!value) {
			this.props.resetCompiler();
			this.props.setValue(FORM_CREATE_CONTRACT_SOURCE_CODE, 'editorWorker', false);
			return;
		}

		this.props.setValue(FORM_CREATE_CONTRACT_SOURCE_CODE, 'editorWorker', false);

		if (form.get('code').value === value) {
			return;
		}


		if (value) {
			setTimeout(() => {
				this.props.setValue(FORM_CREATE_CONTRACT_SOURCE_CODE, 'compileLoading', true);
			}, 0);
		}

		if (timeout) {
			clearTimeout(timeout);
		}

		this.props.setValue(FORM_CREATE_CONTRACT_SOURCE_CODE, 'editorWorker', true);


		this.props.setValue(FORM_CREATE_CONTRACT_SOURCE_CODE, 'compileLoading', true);
		this.setState({
			useWorker: true,
			timeout: setTimeout(async () => {
				await this.props.contractCodeCompile(value);
				setTimeout(() => {
					this.props.setValue(FORM_CREATE_CONTRACT_SOURCE_CODE, 'compileLoading', false);
				}, 0);
			}, 600),
		});
	}

	onChangeItem(e, value) {
		const { form } = this.props;

		this.props.setFormValue(FORM_CREATE_CONTRACT_SOURCE_CODE, 'name', value);
		this.props.setFormValue(FORM_CREATE_CONTRACT_SOURCE_CODE, 'abi', form.getIn(['contracts', value, 'abi']));
		this.props.setFormValue(FORM_CREATE_CONTRACT_SOURCE_CODE, 'bytecode', form.getIn(['contracts', value, 'bytecode']));
	}

	async onChangeCompiler(e) {
		if (!e.target.textContent) {
			return;
		}
		this.props.setValue(FORM_CREATE_CONTRACT_SOURCE_CODE, 'compileLoading', true);
		await this.props.changeContractCompiler(e.target.textContent);
		this.props.setValue(FORM_CREATE_CONTRACT_SOURCE_CODE, 'compileLoading', false);
	}

	getCompilersOptions() {
		const compilersList = this.props.form.get('compilersList');

		if (!compilersList.size || !compilersList.get('builds')) {
			return [];
		}

		return compilersList.get('builds').map((build) => ({
			key: build.longVersion,
			value: build.longVersion,
			text: build.longVersion,
		}));
	}

	getContracts() {
		const { form } = this.props;

		const [...contractNames] = form.get('contracts').keys();

		return contractNames.map((c, index) => ({ key: index, text: c, value: c }));
	}

	setDropdownUpwardState() {
		const isDropdownUpdward = window.innerHeight < 900;

		this.setState({
			isDropdownUpdward,
		});
	}

	isDisabled() {
		const { form } = this.props;

		return form.get('currentCompiler').error
			|| !form.get('code')
			|| form.get('loading')
			|| form.get('compileLoading');
	}

	render() {

		const { form, intl } = this.props;
		const { isDropdownUpdward, isAceError, useWorker } = this.state;
		const dropdwnPlaceholder = intl.formatMessage({ id: 'smart_contract_page.create_contract_page.source_code.contract_complete_dropdown.placeholder' });

		return (
			<React.Fragment>
				<div className={classnames(
					'editor-wrap',
					{ loading: form.get('compileLoading') },
					{ warning: form.get('editorWorker') && !form.get('compileLoading') },
				)}

				>
					<div className="editor-label">
						<FormattedMessage id="smart_contract_page.create_contract_page.source_code.input.title" />
					</div>
					{
						form.get('code').error && (
							<button
								onMouseEnter={() => { this.setState({ isAceError: true }); }}
								onMouseLeave={() => { this.setState({ isAceError: false }); }}
								className="ace-warning"
							/>
						)
					}
					<AceEditor
						className="editor"
						width="100%"
						height="384px"
						mode="javascript"
						name="editor"
						theme="textmate"
						enableLiveAutocompletion
						editorProps={{ $blockScrolling: true }}
						onLoad={(editor) => { this.onEditorLoad(editor); }}
						style={{
							borderRadius: '4px',
							borderColor: '#DDDDDD',
							fontSize: '15px',
						}}
						onChange={(value) => this.onChange(value)}
						value={form.get('code').value}
						annotations={
							form.get('editorWorker') && !form.get('compileLoading')
								? form.get('annotations') : null
						}
						setOptions={{ useWorker }}
					/>
					{
						isAceError && form.get('code').error &&
						<div className="ace-error">{ intl.formatMessage({ id: form.get('code').error })}</div>
					}

				</div>
				<div className="fields">
					<div className="field">
						<div className="field-label">
							<FormattedMessage id="smart_contract_page.create_contract_page.source_code.compile_version_text" />
						</div>
						<Dropdown
							options={this.getCompilersOptions()}
							value={form.get('currentCompiler').value}
							search
							selection
							placeholder="Compiler version"
							onChange={(e) => this.onChangeCompiler(e)}
							noResultsMessage="No results are found"
							disabled={form.get('loading') || form.get('compileLoading')}
							upward={isDropdownUpdward}
						/>
					</div>
					<div className="field">
						<div className="field-label">
							<FormattedMessage id="smart_contract_page.create_contract_page.source_code.contract_complete_dropdown.title" />
						</div>
						<Dropdown
							options={this.getContracts()}
							value={form.get('name').value}
							selection
							fluid
							placeholder={dropdwnPlaceholder}
							selectOnNavigation={false}
							onChange={(e, { value }) => this.onChangeItem(e, value)}
							disabled={!form.get('contracts').size || form.get('compileLoading')}
							upward={isDropdownUpdward}
						/>
					</div>
				</div>

			</React.Fragment>
		);
	}

}

SourceCode.propTypes = {
	form: PropTypes.object.isRequired,
	contractCodeCompile: PropTypes.func.isRequired,
	changeContractCompiler: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	resetCompiler: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

SourceCode.defaultProps = {};


export default injectIntl(SourceCode);
