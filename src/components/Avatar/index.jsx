import React from 'react';
import PropTypes from 'prop-types';
import { svgAvatar } from 'echojs-ping';

import avatar from '../../assets/images/default-avatar.svg';

class Avatar extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			avatarSize: null,
		};
		this.imageRef = React.createRef();
		this.listener = this.updateAvatarSize.bind(this);
	}

	componentDidMount() {
		this.updateAvatarSize();
		window.addEventListener('resize', this.listener);
		window.addEventListener('load', this.listener);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.listener);
	}

	updateAvatarSize() {
		const avatarSize = this.imageRef.current.offsetHeight;
		if (avatarSize !== this.state.avatarSize) {
			this.setState({ avatarSize });
		}
	}

	render() {
		const { avatarSize } = this.state;
		const { accountName, defaultSize } = this.props;
		return (
			<div ref={this.imageRef} className="avatar-image">
				{
					!accountName ? <img src={avatar} alt="avatar" /> : (
						<div dangerouslySetInnerHTML={
							{ __html: svgAvatar(accountName, avatarSize || defaultSize) }
						}
						/>
					)
				}
			</div>
		);
	}

}

Avatar.propTypes = {
	accountName: PropTypes.string,
	defaultSize: PropTypes.number,
};

Avatar.defaultProps = {
	accountName: '',
	defaultSize: 20,
};

export default Avatar;
