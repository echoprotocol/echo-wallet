import React from 'react';
import { Popup, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class DropdownActionBtn extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			copied: false,
		};
	}

	onCopy() {
		this.setState({ copied: true });

		setTimeout(() => {
			this.setState({ copied: false });
		}, 400000);
	}

	action(e) {

		this.onCopy();
		this.props.action(e);
	}

	render() {
		const { copy } = this.props;
		const { copied } = this.state;

		return (
			<Popup
				open={copied}
				className="copied-tooltip"
				trigger={
					<CopyToClipboard onCopy={() => this.onCopy()} text={copy}>
						<Button
							size="mini"
							onClick={(e) => this.action(e)}
							className="action-btn flat"
							icon="icon-copy"
						/>
					</CopyToClipboard>
				}
				content={<span className="copy-label">koko</span>}
			/>

		);
	}

}

DropdownActionBtn.propTypes = {
	action: PropTypes.func,
	copy: PropTypes.string,
};

DropdownActionBtn.defaultProps = {
	action: () => {},
	copy: '',
};


export default DropdownActionBtn;
