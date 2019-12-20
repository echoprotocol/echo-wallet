import React from 'react';
import { Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CSSTransition } from 'react-transition-group';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { CSS_TRANSITION_SPEED } from '../../constants/GlobalConstants';

class DropdownActionBtn extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			copied: false,
			copiedAnimation: false,
		};
	}

	onCopy() {
		this.setState({ copied: true, copiedAnimation: true });

		setTimeout(() => {
			this.setState({ copiedAnimation: false });
		}, CSS_TRANSITION_SPEED);
	}


	action(e) {
		this.onCopy();
		this.props.action(e);
	}

	render() {
		const {
			copy, show, size,
			icon, text,
		} = this.props;
		const { copied, copiedAnimation } = this.state;

		return (
			<Popup
				open={copied && show}
				className="copied-tooltip"
				trigger={
					<CopyToClipboard onCopy={() => this.onCopy()} text={copy}>
						<button
							onClick={(e) => this.action(e)}
							className={classnames(
								'action-btn',
								{ flat: !text },
								size,
							)}
						>
							{icon && <span className={classnames('icon', icon)} />}
						</button>
					</CopyToClipboard>
				}
				content={
					<CSSTransition
						in={copiedAnimation}
						timeout={CSS_TRANSITION_SPEED}
						classNames="animate-copy-label"
						onExited={() => this.setState({ copied: false })}
						unmountOnExit
						appear
					>
						<span className="copy-label-wrap">
							<span className="copy-label-content">
								<FormattedMessage id="copied_text" />
							</span>
						</span>
					</CSSTransition>
				}
			/>

		);
	}

}

DropdownActionBtn.propTypes = {
	show: PropTypes.bool.isRequired,
	action: PropTypes.func,
	copy: PropTypes.string,
	icon: PropTypes.string,
	text: PropTypes.string,
	size: PropTypes.string,
};

DropdownActionBtn.defaultProps = {
	action: () => {},
	copy: '',
	icon: '',
	text: '',
	size: '',
};


export default DropdownActionBtn;
