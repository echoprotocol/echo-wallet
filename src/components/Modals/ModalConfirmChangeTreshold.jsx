import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class modalConfirmChangeTreshold extends React.Component {

	onAgree() {
		this.props.confirm();
	}
	onDisagree() {
		this.props.close();
	}
	render() {
		const {
			show,
		} = this.props;
		return (
			<Modal className="small unclock-size" open={show} dimmer="inverted">
				<p>Confirm plz</p>
				<Button
					basic
					type="submit"
					className="main-btn"
					onClick={(e) => this.onAgree(e)}
					content="YES"
				/><Button
					basic
					type="submit"
					className="main-btn"
					onClick={() => this.onDisagree()}
					content="NO"
				/>
			</Modal>
		);
	}

}


modalConfirmChangeTreshold.propTypes = {
	show: PropTypes.bool,
	confirm: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
};

modalConfirmChangeTreshold.defaultProps = {
	show: false,
};

export default modalConfirmChangeTreshold;
