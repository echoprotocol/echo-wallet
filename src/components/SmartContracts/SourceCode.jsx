import React from 'react';
// import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { Dropdown } from 'semantic-ui-react';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import classnames from 'classnames';

class SourceCode extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			searchText: '',
		};
	}
	onEditorLoad(editor) {
		editor.setOptions({
			fontSize: '15px',
		});
	}

	versionSearchHanler(e, data) {
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
		const { searchText } = this.state;
		return (
			<React.Fragment>
				<div className="editor-wrap">
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
							border: '1px solid #BABCCB',
						}}
					/>
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
							onSearchChange={(e, data) => this.versionSearchHanler(e, data)}
							placeholder="Compiler version"
							selectOnNavigation={false}
							minCharacters={0}
							noResultsMessage="No results are found"
						/>
					</div>
					<div className="field">
						<div className="field-label">Contract to complete</div>
						<Dropdown
							options={options}
							selection
							fluid
							placeholder="Select contract"
							selectOnNavigation={false}
						/>
					</div>
				</div>
			</React.Fragment>
		);
	}

}

SourceCode.propTypes = {};

SourceCode.defaultProps = {};


export default SourceCode;
