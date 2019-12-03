import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';

class actionBtn extends React.Component {

	renderBtn() {
		const {
			text, icon, action, color,
		} = this.props;
		return (
			<Button
				onClick={() => action()}
				className={classnames(
					'action-btn',
					{ flat: icon },
					color,
				)}
			>
				{icon && <span className={classnames('icon', icon)} />}
				{text && <span className="text">{text}</span>}
			</Button>
		);
	}

	render() {
		const { copy } = this.props;
		return (
			copy ?
				<CopyToClipboard text={copy}>
					{this.renderBtn()}
				</CopyToClipboard>
				: this.renderBtn()
		);
	}

}

actionBtn.propTypes = {
	action: PropTypes.func,
	copy: PropTypes.string,
	text: PropTypes.string,
	icon: PropTypes.string,
	color: PropTypes.string,
};

actionBtn.defaultProps = {
	action: () => {},
	copy: '',
	text: '',
	icon: '',
	color: '',
};


export default actionBtn;
