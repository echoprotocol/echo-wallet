import React from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { FormattedMessage } from 'react-intl';


import { CSS_TRANSITION_SPEED } from '../../constants/GlobalConstants';

class actionBtn extends React.Component {

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
		}, CSS_TRANSITION_SPEED);
	}

	renderBtn() {
		const { copied } = this.state;
		const {
			text, icon, action,
			size, color,
		} = this.props;

		return (
			<button
				onClick={(e) => action(e)}
				type="button"
				className={classnames(
					'action-btn',
					{ flat: !text },
					color,
					size,
				)}
			>
				{icon && <span className={classnames('icon', icon)} />}
				{text && <span className="text">{text}</span>}

				<CSSTransition
					in={copied}
					timeout={CSS_TRANSITION_SPEED}
					classNames="animate-copy-label"
					unmountOnExit
					appear
				>
					<span className="copy-label-wrap">
						<span className="copy-label-content">
							<FormattedMessage id="copied_text" />
						</span>
					</span>
				</CSSTransition>
			</button>
		);
	}

	render() {
		const { copy } = this.props;
		return (
			copy ?
				<CopyToClipboard
					onCopy={() => this.onCopy()}
					text={copy}
				>
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
	size: PropTypes.string,
};

actionBtn.defaultProps = {
	action: () => {},
	copy: '',
	text: '',
	icon: '',
	color: '',
	size: '',
};


export default actionBtn;
