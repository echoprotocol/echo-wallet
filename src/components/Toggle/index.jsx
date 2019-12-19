import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

class Toggle extends React.Component {

	constructor() {
		super();

		this.state = {
			checked: false,
		};

		this.onToggle = this.onToggle.bind(this);
	}

	onToggle() {
		this.setState({
			checked: !this.state.checked,
		});
		this.props.onChange();
	}

	render() {
		const { label } = this.props;
		const { checked } = this.state;
		return (

			<div className="toggle-wrap">
				<button onClick={this.onToggle} className="toggle">
					<span className={`slider ${this.state.checked && 'checked'}`} />
				</button>
				{
					label &&
					<div className="toggle-label">
						{checked ?
							<FormattedMessage id="smart_contract_page.create_contract_page.contract_deploy.eth_accuracy.on" /> :
							<FormattedMessage id="smart_contract_page.create_contract_page.contract_deploy.eth_accuracy.off" />}
					</div>
				}
			</div>
		);
	}

}

Toggle.propTypes = {
	label: PropTypes.bool,
	onChange: PropTypes.func,
};

Toggle.defaultProps = {
	label: true,
	onChange: () => { },
};


export default Toggle;
