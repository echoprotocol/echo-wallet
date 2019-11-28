import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import classnames from 'classnames';
import { Dropdown } from 'semantic-ui-react';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';

class SourceCode extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			timeout: null,
		};
	}

	componentDidMount() {
		this.props.setDefaultAsset();
	}

	componentWillUnmount() {
		this.props.clearForm();
	}


	onEditorLoad(editor) {
		editor.setOptions({
			fontSize: '15px',
		});
	}

	onChange(value) {
		const { timeout } = this.state;
		const { form } = this.props;

		this.props.setFormValue('code', value);

		if (!value) {
			this.props.resetCompiler();
			return;
		}
		if (form.get('code').value === value) {
			return;
		}

		if (value) {
			setTimeout(() => {
				this.props.setValue('compileLoading', true);
			}, 0);
		}

		if (timeout) {
			clearTimeout(timeout);
		}

		this.props.setValue('compileLoading', true);
		this.setState({
			timeout: setTimeout(async () => {
				await this.props.contractCodeCompile(value);
				setTimeout(() => {
					this.props.setValue('compileLoading', false);
				}, 0);
			}, 600),
		});
	}

	onChangeItem(e, value) {
		const { form } = this.props;

		this.props.setFormValue('name', value);
		this.props.setFormValue('abi', form.getIn(['contracts', value, 'abi']));
		this.props.setFormValue('bytecode', form.getIn(['contracts', value, 'bytecode']));
	}

	async onChangeCompiler(e) {
		if (!e.target.textContent) {
			return;
		}
		this.props.setValue('compileLoading', true);
		await this.props.changeContractCompiler(e.target.textContent);
		this.props.setValue('compileLoading', false);
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

	isDisabled() {
		const { form } = this.props;

		return form.get('currentCompiler').error
			|| !form.get('code')
			|| form.get('loading')
			|| form.get('compileLoading');
	}

	render() {

		const { form } = this.props;
		return (
			<React.Fragment>
				<div className={classnames(['editor-wrap error-wrap',
					{ error: !!form.get('code').error },
					{ loading: form.get('compileLoading') }])}
				>
					<div className="editor-label">CODE EDITOR</div>
					<AceEditor
						className="editor"
						width="100%"
						height="384px"
						mode="javascript"
						name="editor"
						enableLiveAutocompletion
						editorProps={{ $blockScrolling: true }}
						onLoad={(editor) => { this.onEditorLoad(editor); }}
						style={{
							borderRadius: '4px',
							borderColor: '#DDDDDD',
						}}
						onChange={(value) => this.onChange(value)}
						value={form.get('code').value}
					/>
					{form.get('code').error && <span className="error-message">{form.get('code').error}</span>}
				</div>
				<div className="fields">
					<div className="field">
						<div className="field-label">Compiler version</div>
						<Dropdown
							options={this.getCompilersOptions()}
							value={form.get('currentCompiler').value}
							search
							selection
							placeholder="Compiler version"
							onChange={(e) => this.onChangeCompiler(e)}
							noResultsMessage="No results are found"
							disabled={form.get('loading') || form.get('compileLoading')}
						/>
					</div>
					<div className="field">
						<div className="field-label">Contract to complete</div>
						<Dropdown
							options={this.getContracts()}
							value={form.get('name').value}
							selection
							fluid
							placeholder="Select contract"
							selectOnNavigation={false}
							onChange={(e, { value }) => this.onChangeItem(e, value)}
							disabled={!form.get('contracts').size || form.get('compileLoading')}
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
	clearForm: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	resetCompiler: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
};

SourceCode.defaultProps = {};


export default SourceCode;
