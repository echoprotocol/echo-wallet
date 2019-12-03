import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import { CSS_TRANSITION_SPEED } from '../../constants/GlobalConstants';

class inputActionBtn extends React.Component {

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
		}, 4000);
	}


	render() {
		const { copy, action } = this.props;
		const { copied } = this.state;

		return (
			<CopyToClipboard
				onCopy={() => this.onCopy()}
				text={copy}
			>
				<Button
					onClick={() => action()}
					className={classnames('input-action-btn')}
				>
					<span className="icon-copy" />

					<CSSTransition
						in={copied}
						timeout={CSS_TRANSITION_SPEED}
						classNames="copy-label"
						unmountOnExit
						appear
					>
						<span>copied</span>
					</CSSTransition>
				</Button>
			</CopyToClipboard>
		);
	}

}

inputActionBtn.propTypes = {
	action: PropTypes.func,
	copy: PropTypes.string,
};

inputActionBtn.defaultProps = {
	action: () => {},
	copy: '',
};


export default inputActionBtn;
