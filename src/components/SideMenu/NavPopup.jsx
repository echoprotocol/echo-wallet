import React from 'react';
import PropTypes from 'prop-types';

class NavPopup extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			visible: this.props.visible,
		};
	}

	componentDidUpdate(prevProps) {
		const { wait } = this.props;
		if (prevProps.visible !== this.props.visible) {
			if (this.props.visible === true) {
				setTimeout(() => {
					this.setState({ visible: this.props.visible });
				}, wait);
			} else {
				this.setState({ visible: this.props.visible });
			}
		}
	}

	render() {
		const { value } = this.props;
		if (this.state.visible) {
			return (
				<div className="nav-popup">
					{value}
				</div>
			);
		}
		return null;
	}

}

NavPopup.propTypes = {
	value: PropTypes.string.isRequired,
	wait: PropTypes.number.isRequired,
	visible: PropTypes.bool.isRequired,
};

export default NavPopup;
