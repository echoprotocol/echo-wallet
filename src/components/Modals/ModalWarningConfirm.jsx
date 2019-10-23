import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ModalWarningConfirm extends React.Component {

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


ModalWarningConfirm.propTypes = {
	show: PropTypes.bool,
	confirm: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
};

ModalWarningConfirm.defaultProps = {
	show: false,
};

export default ModalWarningConfirm;
