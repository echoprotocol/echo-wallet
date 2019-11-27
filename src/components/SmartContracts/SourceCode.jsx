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
			searchText: '',
			timeout: null,
		};
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
		this.props.setFormValue('code', value);
		if (timeout) {
			clearTimeout(timeout);
		}

		this.setState({
			timeout: setTimeout(async () => {
				await this.props.contractCodeCompile(value);
			}, 600),
		});
	}

	onChangeItem(e, value) {
		const { form } = this.props;

		this.props.setFormValue('name', value);
		this.props.setFormValue('abi', form.getIn(['contracts', value, 'abi']));
		this.props.setFormValue('bytecode', form.getIn(['contracts', value, 'bytecode']));
	}

	getContracts() {
		const { form } = this.props;

		const [...contractNames] = form.get('contracts').keys();

		return contractNames.map((c, index) => ({ key: index, text: c, value: c }));
	}

	versionSearchHandler(e, data) {
		this.setState({
			searchText: data.searchQuery,
		});
	}


	render() {
		const options = [
			{ key: 1, text: 'Choice 1', value: 1 },
			{ key: 2, text: 'Choice 2', value: 2 },
			{ key: 3, text: 'Choice 3', value: 3 },
		];
		const { form } = this.props;
		const { searchText } = this.state;
		return (
			<React.Fragment>
				<div className={classnames(['editor-wrap error-wrap', { error: false }])} >
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
					{ false && <span className="error-message">some error</span>}
				</div>
				<div className="fields">
					<div className="field">
						<div className="field-label">Compiler version</div>
						<Dropdown
							options={options}
							searchQuery={searchText}
							search
							selection
							fluid
							text={searchText || 'Compiler version'}
							onSearchChange={(e, data) => this.versionSearchHandler(e, data)}
							placeholder="Compiler version"
							selectOnNavigation={false}
							minCharacters={0}
							noResultsMessage="No results are found"
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
							disabled={!form.get('contracts').size}
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
	setFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
};

SourceCode.defaultProps = {};


export default SourceCode;
